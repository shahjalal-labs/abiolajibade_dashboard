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
import { RotateCw } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import NoData from "@/components/Common/NoData";
import Pagination from "@/components/Common/Pagination";
import {
  useAcceptRejectMutation,
  useAllPendingWorkersQuery,  
} from "@/redux/api/authApi";
import { toast } from "sonner";
import WorkerDetailsModal from "./WorkerDetailsModal";

const AllPendingWorkers = () => {
  const searchParams = useSearchParams();
  const searchData = searchParams.get("searchData");
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState(searchData); // 🔑 Track which row is being acted on
  const [activeUserId, setActiveUserId] = useState<string | null>(null);

  const {
    data: users,
    isLoading,
    isFetching,
  } = useAllPendingWorkersQuery({ page, searchTerm: searchTerm || "" });
  const [acceptReject, { isLoading: acceptRejectLoading }] =
    useAcceptRejectMutation();

  const totalPage = users?.result?.meta?.totalPages;

  const handleAcceptReject = async (id: string, accept: boolean) => {
    const payload = {
      workerId: id,
      accept,
    };

    const response = await acceptReject(payload).unwrap();
    if (response?.success) {
      toast.success(response?.message || "Action performed successfully");
    } else {
      toast.error(response?.message || "Something went wrong");
    }
  };

  return (
    <div className="p-5 mb-6 bg-white rounded-xl">
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 mb-4">
        <h1 className="md:font-medium">Worker List</h1>
        <div className="flex flex-col md:flex-row gap-2 w-full lg:w-auto">
          <input
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border px-2 rounded-lg py-1 flex-1 md:flex-none"
            placeholder="search by name or email.."
            type="text"
          />
          <button
            onClick={() => window.location.reload()}
            className="border flex items-center justify-center gap-1 px-4 text-gray-600 rounded-[6px] cursor-pointer py-1 md:justify-start"
          >
            Refresh <RotateCw size={15}></RotateCw>
          </button>
        </div>
      </div>

      <Table className="rounded-lg min-w-[900px]">
        <TableHeader className="bg-gray-50">
          <TableRow>
            <TableHead className="w-[250px] whitespace-nowrap">
              Worker Details
            </TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Application Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {users?.result?.workers?.length > 0 ? (
            users.result.workers.map((user: any) => {
              const isCurrent = activeUserId === user.id;

              return (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={
                            user?.profileImage ||
                            "https://sefr.lon1.digitaloceanspaces.com/sefr/uploads/messages/files/1770264884749-t0grnc2npkj.png"
                          }
                          alt={user?.userName}
                        />
                        <AvatarFallback>{user?.userName}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-gray-900">
                        {user?.userName}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{user?.email}</TableCell>
                  <TableCell>
                    {new Date(user?.createdAt).toLocaleString("en-US", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </TableCell>
                  <TableCell>{user?.status}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <WorkerDetailsModal id={user.id} />
                      <button
                        onClick={() => handleAcceptReject(user.id, true)}
                        className="bg-green-50 text-green-600 px-6 py-2 rounded-xl"
                      >
                        Accpet
                      </button>
                      <button
                        onClick={() => handleAcceptReject(user.id, false)}
                        className="bg-red-50 text-red-600 px-6 py-2 rounded-xl"
                      >
                        Decline
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <NoData
              title="Worker"
              isLoading={isLoading}
              isFetching={isFetching}
            />
          )}
        </TableBody>
      </Table>

      {users?.result?.workers?.length > 0 && (
        <Pagination totalPage={totalPage} page={page} setPage={setPage} />
      )}
    </div>
  );
};

export default AllPendingWorkers;
