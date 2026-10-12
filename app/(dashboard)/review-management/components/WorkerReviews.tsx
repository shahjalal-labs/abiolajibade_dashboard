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

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import NoData from "@/components/Common/NoData";
import Pagination from "@/components/Common/Pagination";
import { useWorkerReviewQuery } from "@/redux/api/reviewApi";
import { FaStar } from "react-icons/fa6";

const WorkerReviews = () => {
  const [page, setPage] = useState(1);
  const [activeUserId, setActiveUserId] = useState<string | null>(null);
  const { data: users, isLoading, isFetching } = useWorkerReviewQuery(page);

  const totalPage = users?.result?.meta?.totalPages;

  return (
    <div className="p-5 mb-6 bg-white rounded-xl">
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 mb-4">
        <h1 className="md:font-medium">Workers Given Review To User List</h1>
        <div className="flex flex-col md:flex-row gap-2 w-full lg:w-auto">
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
              Reviewer Details
            </TableHead>
            <TableHead>User Details</TableHead>
            <TableHead>Reviewd At</TableHead>
            <TableHead>Rating</TableHead>
            <TableHead>Comment</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {users?.result?.reviews?.length > 0 ? (
            users.result.reviews.map((user: any) => {
              const isCurrent = activeUserId === user.id;

              return (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={
                            user?.worker?.profileImage ||
                            "https://sefr.lon1.digitaloceanspaces.com/sefr/uploads/messages/files/1770264884749-t0grnc2npkj.png"
                          }
                          alt={user?.worker?.userName}
                        />
                        <AvatarFallback>{user?.worker?.userName}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-gray-900">
                        {user?.worker?.userName}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={
                            user?.reviewer?.profileImage ||
                            "https://sefr.lon1.digitaloceanspaces.com/sefr/uploads/messages/files/1770264884749-t0grnc2npkj.png"
                          }
                          alt={user?.reviewer?.userName}
                        />
                        <AvatarFallback>
                          {user?.reviewer?.userName}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-gray-900">
                        {user?.reviewer?.userName}
                      </span>
                    </div>
                  </TableCell>
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
                  <TableCell>
                    <div className="flex gap-1 items-center">
                      <FaStar className="text-yellow-500"></FaStar>
                      {user.rating}
                    </div>
                  </TableCell>

                  <TableCell>{user.comment}</TableCell>
                  <TableCell>
                    <Trash className="text-red-600"></Trash>
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <NoData
              title="Review"
              isLoading={isLoading}
              isFetching={isFetching}
            />
          )}
        </TableBody>
      </Table>

      {users?.result?.reviews?.length > 0 && (
        <Pagination totalPage={totalPage} page={page} setPage={setPage} />
      )}
    </div>
  );
};

export default WorkerReviews;
