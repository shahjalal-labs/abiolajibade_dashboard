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
import { format } from "date-fns";
import { RotateCw } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import NoData from "@/components/Common/NoData";
import { useAllUsersQuery } from "@/redux/api/authApi";
import Pagination from "@/components/Common/Pagination";
import {
  useAcceptWithdrawRequestMutation,
  useAllWithdrawsQuery,
  useRejectWithdrawRequestMutation,
} from "@/redux/api/withdrawApi";
import { toast } from "sonner";

const AllWithdraws = () => {
  const searchParams = useSearchParams();
  const searchData = searchParams.get("searchData");
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState(searchData); // 🔑 Track which row is being acted on
  const [activeUserId, setActiveUserId] = useState<string | null>(null);

  const {
    data: users,
    isLoading,
    isFetching,
  } = useAllWithdrawsQuery({ page, status: searchTerm || "" });

  const [acceptRequest, { isLoading: isAccepting }] =
    useAcceptWithdrawRequestMutation();
  const [rejectRequest, { isLoading: isRejecting }] =
    useRejectWithdrawRequestMutation();

  const totalPage = users?.result?.meta?.totalPages;

  const handleAccept = async (id: string) => {
    setActiveUserId(id);
    try {
      const response = await acceptRequest(id).unwrap();
      toast.success(
        response.message || "Withdraw request accepted successfully",
      );
    } catch (error) {
      console.error("Error accepting withdraw request:", error);
    }
  };

  const handleReject = async (id: string) => {
    setActiveUserId(id);
    try {
      const response = await rejectRequest(id).unwrap();
      toast.success(
        response.message || "Withdraw request rejected successfully",
      );
    } catch (error) {
      console.error("Error rejecting withdraw request:", error);
    }
  };

  return (
    <div className="p-5 mb-6 bg-white rounded-xl">
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 mb-4">
        <h1 className="md:font-medium">Withdraw List</h1>
        <div className="flex flex-col md:flex-row gap-2 w-full lg:w-auto">
          <select
            className="bg-bprimary/10 rounded-[6px] px-4 text-bprimary"
            onChange={(e) => setSearchTerm(e.target.value)}
            name=""
            id=""
          >
            <option value="">All</option>
            <option value="Pending">Pending</option>
            <option value="Accepted">Accepted</option>
          </select>
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
            <TableHead>Amount</TableHead>
            <TableHead>Requested At</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {users?.result?.withdraws?.length > 0 ? (
            users.result.withdraws.map((user: any) => {
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
                        <AvatarFallback>
                          {user?.worker?.userName}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-gray-900">
                        {user?.worker?.userName}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>${user?.amount}</TableCell>
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
                  <TableCell
                    className={`${user?.status === "Accepted" ? "text-green-600" : "text-yellow-600"}`}
                  >
                    {user?.status}
                  </TableCell>
                  <TableCell>
                    {user.status == "Accepted" ? (
                      "No Action Required"
                    ) : (
                      <div className="flex">
                        <button
                          disabled={user?.status === "Accepted"}
                          onClick={() => handleReject(user.id)}
                          className="bg-red-50 text-red-600 px-4 py-1 rounded mr-2"
                        >
                          Reject
                        </button>
                        <button
                          disabled={user?.status === "Accepted"}
                          onClick={() => handleAccept(user.id)}
                          className="bg-green-50 text-green-600 px-4 py-1 rounded-[6px]"
                        >
                          Accept
                        </button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <NoData
              title="Withdraw"
              isLoading={isLoading}
              isFetching={isFetching}
            />
          )}
        </TableBody>
      </Table>

      {users?.result?.withdraws?.length > 0 && (
        <Pagination totalPage={totalPage} page={page} setPage={setPage} />
      )}
    </div>
  );
};

export default AllWithdraws;
