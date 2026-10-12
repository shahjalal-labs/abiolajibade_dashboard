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
import { useAllUsersQuery, useBlockUnblockMutation } from "@/redux/api/authApi";
import Pagination from "@/components/Common/Pagination";
import { toast } from "sonner";
import UserDetailsModal from "./UserDetailsModal";

const AllUsers = () => {
  const searchParams = useSearchParams();
  const searchData = searchParams.get("searchData");
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState(searchData); // 🔑 Track which row is being acted on
  const [activeUserId, setActiveUserId] = useState<string | null>(null);

  const {
    data: users,
    isLoading,
    isFetching,
  } = useAllUsersQuery({ page, searchTerm: searchTerm || "" });
  const [blockUnblock, { isLoading: blockUnblockLoading }] =
    useBlockUnblockMutation();

  const totalPage = users?.result?.meta?.totalPages;

  const handleBlockUnblockUser = async (id: string) => {
    const response = await blockUnblock(id).unwrap();
    if (response?.success) {
      toast.success(response?.message || "Action performed successfully");
    } else {
      toast.error(response?.message || "Something went wrong");
    }
  };

  return (
    <div className="p-5 mb-6 bg-white rounded-xl">
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 mb-4">
        <h1 className="md:font-medium">User List</h1>
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
              User Details
            </TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Join Date</TableHead>
            <TableHead>Total Bookings</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {users?.result?.users?.length > 0 ? (
            users.result.users.map((user: any) => {
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
                  <TableCell>{user?._count.userBookings}</TableCell>
                  <TableCell className="px-2 py-1">
                    <span
                      className={`px-2 py-1 rounded-xl text-sm font-medium ${
                        user?.status === "Blocked"
                          ? "bg-red-50 text-red-600"
                          : "bg-green-50 text-green-600"
                      }`}
                    >
                      {user.status}
                    </span>
                  </TableCell>

                  <TableCell>
                    <div className="flex gap-3">
                      <UserDetailsModal id={user.id}></UserDetailsModal>
                      <button
                        onClick={() => handleBlockUnblockUser(user.id)}
                        className={`px-4 cursor-pointer py-2 rounded-xl ${user.status == "Blocked" ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"}`}
                      >
                        {user.status == "Blocked" ? "Unblock" : "Block"}
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <NoData
              title="User"
              isLoading={isLoading}
              isFetching={isFetching}
            />
          )}
        </TableBody>
      </Table>

      {users?.result?.users?.length > 0 && (
        <Pagination totalPage={totalPage} page={page} setPage={setPage} />
      )}
    </div>
  );
};

export default AllUsers;
