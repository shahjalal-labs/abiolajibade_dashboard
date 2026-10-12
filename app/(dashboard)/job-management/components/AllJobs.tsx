"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";
import { RotateCw, Trash } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import NoData from "@/components/Common/NoData";
import Pagination from "@/components/Common/Pagination";
import { useAllJobsQuery, useDeleteJobMutation } from "@/redux/api/jobApi";
import { toast } from "sonner";

const AllJobs = () => {
  const searchParams = useSearchParams();
  const searchData = searchParams.get("searchData");
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState(searchData);
  const [selectedJob, setSelectedJob] = useState<any | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const {
    data: users,
    isLoading,
    isFetching,
  } = useAllJobsQuery({ page, searchTerm: searchTerm || "" });

  const [deleteJob, { isLoading: isDeleting }] = useDeleteJobMutation();

  const totalPage = users?.result?.meta?.totalPages;
  const totalJobs =
    users?.result?.meta?.totalDocs || users?.result?.jobs?.length || 0;

  const handleDialogChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      setSelectedJob(null);
    }
  };

  const deleteJobHandler = async (jobId: string) => {
    const response = await deleteJob(jobId).unwrap();
    if (response?.success) {
      toast.success("Job deleted successfully");
    } else {
      toast.error(response?.message || "Failed to delete job");
    }
  };

  return (
    <div className="p-5 mb-6 bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 mb-5">
        <div>
          <h1 className="text-lg font-semibold text-gray-900">
            Job Management
          </h1>
          <p className="text-sm text-gray-500">{totalJobs} jobs found</p>
        </div>
        <div className="flex flex-col md:flex-row gap-2 w-full lg:w-auto">
          <input
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-gray-200 px-3 rounded-lg py-2 text-sm flex-1 md:flex-none focus:outline-none focus:ring-2 focus:ring-gray-200"
            placeholder="Search by title, user, or skill"
            type="text"
          />
          <button
            onClick={() => window.location.reload()}
            className="border border-gray-200 flex items-center justify-center gap-1 px-4 text-gray-700 rounded-lg cursor-pointer py-2 text-sm hover:bg-gray-50 md:justify-start"
          >
            Refresh <RotateCw size={15}></RotateCw>
          </button>
        </div>
      </div>

      <Table className="rounded-lg min-w-[900px]">
        <TableHeader className="bg-gray-50">
          <TableRow>
            <TableHead className="w-[250px] whitespace-nowrap">
              User Details
            </TableHead>
            <TableHead>Job Title</TableHead>
            <TableHead>Required Skill</TableHead>
            <TableHead>Address</TableHead>
            <TableHead>Applications</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {users?.result?.jobs?.length > 0 ? (
            users.result.jobs.map((job: any) => {
              const applications = job?.applications || [];
              return (
                <TableRow key={job.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={
                            job?.user?.profileImage ||
                            "https://sefr.lon1.digitaloceanspaces.com/sefr/uploads/messages/files/1770264884749-t0grnc2npkj.png"
                          }
                          alt={job?.user?.userName}
                        />
                        <AvatarFallback>{job?.user?.userName}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-gray-900">
                          {job?.user?.userName}
                        </p>
                        <p className="text-xs text-gray-500">Job owner</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="font-medium text-gray-900">{job?.title}</p>
                    <p className="text-xs text-gray-500 line-clamp-1">
                      {job?.description}
                    </p>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-gray-700">{job?.skill}</span>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm text-gray-700">{job?.address}</p>
                    <p className="text-xs text-gray-500">
                      {job?.street} {job?.postal}
                    </p>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-600">
                        ({applications.length})
                      </span>
                      <button
                        className="py-1 bg-bprimary/10 cursor-pointer text-bprimary px-4 rounded-[6px]"
                        onClick={() => {
                          setSelectedJob(job);
                          setIsDialogOpen(true);
                        }}
                      >
                        View Applier Details
                      </button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Trash
                      onClick={() => deleteJobHandler(job.id)}
                      className="cursor-pointer text-red-500"
                    />
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <NoData
              title="Jobs"
              isLoading={isLoading}
              isFetching={isFetching}
            />
          )}
        </TableBody>
      </Table>

      {users?.result?.jobs?.length > 0 && (
        <Pagination totalPage={totalPage} page={page} setPage={setPage} />
      )}

      <Dialog open={isDialogOpen} onOpenChange={handleDialogChange}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Applier Details</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
              <p className="text-xs uppercase tracking-wide text-gray-500">
                Job
              </p>
              <p className="text-sm font-semibold text-gray-900 mt-1">
                {selectedJob?.title || ""}
              </p>
              <p className="text-xs text-gray-600 mt-1">
                {selectedJob?.address} {selectedJob?.street}{" "}
                {selectedJob?.postal}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-900">
                Applicants ({selectedJob?.applications?.length || 0})
              </p>
              {selectedJob?.applications?.length ? (
                <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                  {selectedJob.applications.map(
                    (application: any, index: number) => (
                      <div
                        key={`application-${index}`}
                        className="flex items-start gap-3 rounded-lg border border-gray-100 p-3"
                      >
                        <Avatar className="h-10 w-10">
                          <AvatarImage
                            src={application?.worker?.profileImage}
                            alt={application?.worker?.userName}
                          />
                          <AvatarFallback>
                            {application?.worker?.userName}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {application?.worker?.userName}
                          </p>
                          <p className="text-xs text-gray-500">
                            {application?.worker?.email}
                          </p>
                          {application?.note && (
                            <p className="text-xs text-gray-600 mt-2">
                              "{application.note}"
                            </p>
                          )}
                        </div>
                      </div>
                    ),
                  )}
                </div>
              ) : (
                <p className="text-sm text-gray-500 mt-2">
                  No applications yet.
                </p>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AllJobs;
