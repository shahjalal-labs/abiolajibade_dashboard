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
import { MessageSquare, RotateCw, Send } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import NoData from "@/components/Common/NoData";
import Pagination from "@/components/Common/Pagination";
import {
  useResponseUserReportMutation,
  useUserReportsQuery,
} from "@/redux/api/reportApi";

const UserReports = () => {
  const searchParams = useSearchParams();
  const searchData = searchParams.get("searchData");
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState(searchData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<any | null>(null);
  const [status, setStatus] = useState<string>("");
  const [adminReply, setAdminReply] = useState<string>("");
  const [partialRefundPercentage, setPartialRefundPercentage] =
    useState<string>("");

  const { data: users, isLoading, isFetching } = useUserReportsQuery(page);
  const [respondReport, { isLoading: isResponding }] =
    useResponseUserReportMutation();

  const totalPage = users?.result?.meta?.totalPages;

  const handleOpenModal = (report: any) => {
    setSelectedReport(report);
    setStatus("");
    setAdminReply("");
    setPartialRefundPercentage("");
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedReport(null);
    setStatus("");
    setAdminReply("");
    setPartialRefundPercentage("");
  };

  const handleSubmitResponse = async () => {
    if (!status || !adminReply.trim()) {
      alert("Please fill in all fields");
      return;
    }

    const isPartialRefund = status === "Partial_Refund";
    const isValidPartialPercentage = /^(?:[1-9]|[1-9][0-9])$/.test(
      partialRefundPercentage,
    );

    if (isPartialRefund && !isValidPartialPercentage) {
      alert("Please enter a valid percentage between 1 and 99");
      return;
    }

    try {
      await respondReport({
        reportId: selectedReport?.id,
        status,
        adminReply,
        ...(isPartialRefund && {
          percentage: Number(partialRefundPercentage),
        }),
      }).unwrap();
      handleCloseModal();
    } catch (error) {
      console.error("Error responding to report:", error);
    }
  };

  return (
    <div className="p-5 mb-6 bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 mb-5">
        <div>
          <h1 className="text-lg font-semibold text-gray-900">
            User Report List
          </h1>
        </div>
      </div>

      <Table className="rounded-lg min-w-[1000px]">
        <TableHeader className="bg-gray-50">
          <TableRow>
            <TableHead className="w-[120px]">Booking ID</TableHead>
            <TableHead>Issue</TableHead>
            <TableHead>Reported At</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Admin Response</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {users?.result?.reports?.length > 0 ? (
            users.result.reports.map((report: any) => {
              const hasAdminReply = !!report.adminReply;

              return (
                <TableRow key={report.id} className="hover:bg-gray-50">
                  <TableCell className="font-mono text-xs text-gray-600 truncate">
                    {report?.bookingId}
                  </TableCell>
                  <TableCell>
                    <p className="text-sm text-gray-900 ">{report.comment}</p>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm text-gray-700">
                      {new Date(report?.createdAt).toLocaleString("en-US", {
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
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                        report?.status === "Pending"
                          ? "bg-yellow-50 text-yellow-700"
                          : report?.status === "Partial_Refund"
                            ? "bg-blue-50 text-blue-700"
                            : report?.status === "Resolved"
                              ? "bg-green-50 text-green-700"
                              : "bg-gray-50 text-gray-700"
                      }`}
                    >
                      {report?.status === "Pending"
                        ? "Waiting Response"
                        : report?.status == "Partial_Refund"
                          ? "Partial Refund"
                          : report?.status == "False_Claim"
                            ? "False Claim"
                            : "Refunded"}
                    </span>
                  </TableCell>
                  <TableCell>
                    {hasAdminReply ? (
                      <div className="flex items-start gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-700 line-clamp-2">
                            {report.adminReply}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <button
                        className="flex items-center bg-bprimary/10 justify-center gap-1 px-4 text-bprimary rounded-lg cursor-pointer py-2 text-sm"
                        onClick={() => handleOpenModal(report)}
                      >
                        Respond
                      </button>
                    )}
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <NoData
              title="Reports"
              isLoading={isLoading}
              isFetching={isFetching}
            />
          )}
        </TableBody>
      </Table>

      {users?.result?.reports?.length > 0 && (
        <Pagination totalPage={totalPage} page={page} setPage={setPage} />
      )}

      {/* Response Modal */}
      <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageSquare size={20} />
              Respond to Report
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Status Selection */}
            <div className="space-y-2">
              <Label
                htmlFor="status"
                className="text-sm font-medium text-gray-900"
              >
                Resolution Status
              </Label>
              <Select
                value={status}
                onValueChange={(value) => {
                  setStatus(value);
                  if (value !== "Partial_Refund") {
                    setPartialRefundPercentage("");
                  }
                }}
              >
                <SelectTrigger id="status" className="border border-gray-200">
                  <SelectValue placeholder="Select a status..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Got_Refund">
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      Give Refund
                    </span>
                  </SelectItem>
                  <SelectItem value="Partial_Refund">
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      Partial Refund
                    </span>
                  </SelectItem>
                  <SelectItem value="False_Claim">
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                      False Claim
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {status === "Partial_Refund" && (
              <div className="space-y-2">
                <Label
                  htmlFor="partial-refund-percentage"
                  className="text-sm font-medium text-gray-900"
                >
                  Refund Percentage
                </Label>
                <div className="relative">
                  <Input
                    id="partial-refund-percentage"
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    placeholder="Enter percentage (1-99)"
                    value={partialRefundPercentage}
                    onChange={(e) => {
                      const numericOnly = e.target.value.replace(/\D/g, "");
                      setPartialRefundPercentage(numericOnly.slice(0, 2));
                    }}
                    className="pr-8 border border-gray-200"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                    %
                  </span>
                </div>
                <p className="text-xs text-gray-500">
                  Enter a whole number from 1 to 99.
                </p>
              </div>
            )}

            {/* Admin Reply Textarea */}
            <div className="space-y-2">
              <Label
                htmlFor="reply"
                className="text-sm font-medium text-gray-900"
              >
                Your Response
              </Label>
              <Textarea
                id="reply"
                placeholder="Write your response to this report..."
                value={adminReply}
                onChange={(e) => setAdminReply(e.target.value)}
                className="min-h-32 border border-gray-200 focus:ring-2 focus:ring-gray-200"
              />
              <p className="text-xs text-gray-500">
                {adminReply.length} / 500 characters
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 justify-end pt-2">
              <Button
                variant="outline"
                onClick={handleCloseModal}
                disabled={isResponding}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmitResponse}
                disabled={
                  isResponding ||
                  !status ||
                  !adminReply.trim() ||
                  (status === "Partial_Refund" &&
                    !/^(?:[1-9]|[1-9][0-9])$/.test(partialRefundPercentage))
                }
                className="gap-1.5"
              >
                {isResponding ? (
                  <>
                    <span className="inline-block animate-spin">⏳</span>
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send size={14} />
                    Submit Response
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserReports;
