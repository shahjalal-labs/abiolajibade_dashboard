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
import { FileImage, RotateCw } from "lucide-react";
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
import { useAllbookingsQuery } from "@/redux/api/bookingApi";

const AllBookings = () => {
  const searchParams = useSearchParams();
  const searchData = searchParams.get("searchData");
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState(searchData);
  const [isProofsDialogOpen, setIsProofsDialogOpen] = useState(false);
  const [selectedProofs, setSelectedProofs] = useState<any | null>(null);

  const { data: users, isLoading, isFetching } = useAllbookingsQuery(page);

  const totalPage = users?.result?.meta?.totalPages;
  const totalBookings =
    users?.result?.meta?.totalDocs || users?.result?.bookings?.length || 0;

  const handleViewProofs = (bookingData: any) => {
    setSelectedProofs(bookingData);
    setIsProofsDialogOpen(true);
  };

  const handleDialogChange = (open: boolean) => {
    setIsProofsDialogOpen(open);
    if (!open) {
      setSelectedProofs(null);
    }
  };

  return (
    <div className="p-5 mb-6 bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 mb-5">
        <div>
          <h1 className="text-lg font-semibold text-gray-900">
            Appointment Management
          </h1>
          <p className="text-sm text-gray-500">
            {totalBookings} appointments found
          </p>
        </div>
        <div className="flex flex-col md:flex-row gap-2 w-full lg:w-auto">
          <button
            onClick={() => window.location.reload()}
            className="border border-gray-200 flex items-center justify-center gap-1 px-4 text-gray-700 rounded-lg cursor-pointer py-2 text-sm hover:bg-gray-50 md:justify-start"
          >
            Refresh <RotateCw size={15} />
          </button>
        </div>
      </div>

      <Table className="rounded-lg min-w-[1000px]">
        <TableHeader className="bg-gray-50">
          <TableRow>
            <TableHead>Appointment ID</TableHead>
            <TableHead className="w-[180px] whitespace-nowrap">
              User
            </TableHead>
            <TableHead className="w-[180px] whitespace-nowrap">
              Worker
            </TableHead>
            <TableHead className="w-[150px]">Purpose</TableHead>
            <TableHead className="w-[100px]">Fee</TableHead>
            <TableHead className="w-[120px]">Overtime Fee</TableHead>
            <TableHead className="w-[180px]">Date & Time</TableHead>
            <TableHead className="w-[100px]">Status</TableHead>
            <TableHead className="w-[140px]">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {users?.result?.bookings?.length > 0 ? (
            users.result.bookings.map((booking: any) => {
              const deliveryProofs = booking?.deliveryProofs || [];
              const isCompleted = booking?.status === "Completed";
              const hasProofs = isCompleted && deliveryProofs.length > 0;

              return (
                <TableRow key={booking.id} className="hover:bg-gray-50">
                  <TableCell>
                    {" "}
                    <p className="text-xs text-gray-500 truncate">
                      {booking?.id}
                    </p>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-9 w-9">
                        <AvatarImage
                          src={
                            booking?.user?.profileImage ||
                            "https://sefr.lon1.digitaloceanspaces.com/sefr/uploads/messages/files/1770264884749-t0grnc2npkj.png"
                          }
                          alt={booking?.user?.userName}
                        />
                        <AvatarFallback>
                          {booking?.user?.userName?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="font-medium text-gray-900 truncate">
                          {booking?.user?.userName}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {booking?.user?.email}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-9 w-9">
                        <AvatarImage
                          src={
                            booking?.worker?.profileImage ||
                            "https://sefr.lon1.digitaloceanspaces.com/sefr/uploads/messages/files/1770264884749-t0grnc2npkj.png"
                          }
                          alt={booking?.worker?.userName}
                        />
                        <AvatarFallback>
                          {booking?.worker?.userName?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="font-medium text-gray-900 truncate">
                          {booking?.worker?.userName}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {booking?.worker?.email}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm text-gray-700 line-clamp-2">
                      {booking?.purpose}
                    </p>
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700">
                      ${booking?.price}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-sm font-medium bg-amber-50 text-amber-700">
                      ${booking?.overTimeCharge}
                    </span>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm text-gray-700">
                      {new Date(booking?.date).toLocaleString("en-US", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </p>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-sm font-medium ${
                        booking?.status === "Completed"
                          ? "bg-green-50 text-green-700"
                          : booking?.status === "Pending"
                            ? "bg-yellow-50 text-yellow-700"
                            : "bg-gray-50 text-gray-700"
                      }`}
                    >
                      {booking?.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    {hasProofs ? (
                      <button
                        onClick={() => handleViewProofs(booking)}
                        className="gap-1 bg-bprimary/10 cursor-pointer text-bprimary px-4 py-1 rounded-[6px] inline-flex items-center text-sm"
                      >
                        View Proofs
                      </button>
                    ) : (
                      <span className="text-sm text-gray-500">
                        {isCompleted ? "No proofs" : "Not completed"}
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <NoData
              title="Appointments"
              isLoading={isLoading}
              isFetching={isFetching}
            />
          )}
        </TableBody>
      </Table>

      {users?.result?.bookings?.length > 0 && (
        <Pagination totalPage={totalPage} page={page} setPage={setPage} />
      )}

      <Dialog open={isProofsDialogOpen} onOpenChange={handleDialogChange}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileImage size={20} />
              Delivery Proofs
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Delivery Proofs */}
            <div>
              {selectedProofs?.deliveryProofs?.length ? (
                <div className="grid grid-cols-1 gap-4">
                  {selectedProofs.deliveryProofs.map(
                    (proof: any, index: number) => (
                      <div
                        key={`proof-${index}`}
                        className="rounded-lg border border-gray-200 overflow-hidden bg-white hover:shadow-md transition-shadow"
                      >
                        {/* Image Container */}
                        <div className="relative bg-gray-100 aspect-video overflow-hidden">
                          {proof?.fileUrl ? (
                            <>
                              <img
                                src={proof.fileUrl}
                                alt={`Proof ${index + 1}`}
                                className="w-full h-full object-cover hover:scale-105 transition-transform"
                              />
                              <a
                                href={proof.fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="absolute inset-0 bg-black/0 hover:bg-black/10 flex items-center justify-center opacity-0 hover:opacity-100 transition-all"
                              >
                                <Button
                                  variant="secondary"
                                  size="sm"
                                  className="bg-white/90 hover:bg-white"
                                >
                                  Open Full Size
                                </Button>
                              </a>
                            </>
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <FileImage size={40} className="text-gray-300" />
                            </div>
                          )}
                        </div>

                        {/* Message Container */}
                        {proof?.message && (
                          <div className="p-3 border-t border-gray-200">
                            <p className="text-xs uppercase tracking-wide text-gray-600 font-semibold mb-1">
                              Message
                            </p>
                            <p className="text-sm text-gray-700 line-clamp-3">
                              {proof.message}
                            </p>
                          </div>
                        )}
                      </div>
                    ),
                  )}
                </div>
              ) : (
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 text-center">
                  <FileImage size={32} className="mx-auto text-gray-300 mb-2" />
                  <p className="text-sm text-gray-500">
                    No delivery proofs available
                  </p>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AllBookings;
