"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useUserDetailsQuery } from "@/redux/api/authApi";
import { Star, Wallet, TrendingDown } from "lucide-react";

interface UserDetailsModalProps {
  id: string;
}

const UserDetailsModal = ({ id }: UserDetailsModalProps) => {
  const { data: user, isLoading, isError } = useUserDetailsQuery(id);

  const report = user?.result; 

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="bg-blue-50 cursor-pointer text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-100 transition">
          View User Details
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-3xl max-h-[85vh] overflow-auto bg-white rounded-lg p-6">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between gap-3 text-xl font-semibold text-gray-800">
            User Details
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <p className="text-sm text-gray-500 mt-4">Loading details…</p>
        ) : isError ? (
          <p className="text-sm text-gray-500 mt-4">
            Error fetching user details
          </p>
        ) : !report ? (
          <p className="text-sm text-gray-500 mt-4">No user details found</p>
        ) : (
          <div className="flex flex-col gap-6 mt-4">
            {/* Profile Header Section */}
            <div className="md:flex items-center gap-2 md:gap-6 bg-linear-to-r from-blue-50 to-indigo-50 rounded-xl p-2 md:p-6 border border-blue-100">
              <div className="relative">
                <img
                  src={report.profileImage}
                  alt={`${report.userName}'s profile`}
                  className="rounded-full w-24 h-24 object-cover border-4 border-white shadow-md"
                />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-800">
                  {report.userName}
                </h3>
                <p className="text-gray-600 text-sm mt-1">{report.email}</p>
                <div className="flex items-center gap-4 mt-3">
                  <div className="flex items-center gap-1 bg-white px-3 py-1.5 rounded-full shadow-sm">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold text-gray-800">
                      {report.avgRating}
                    </span>
                    <span className="text-gray-500 text-sm">
                      ({report.totalReview} reviews)
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Basic Information */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">
                Basic Information
              </h4>
              <div className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
                <div>
                  <p className="text-gray-500 mb-1">Age</p>
                  <p className="font-medium text-gray-800">
                    {report.userProfile?.age
                      ? `${report.userProfile?.age} years`
                      : "Not provided"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 mb-1">Gender</p>
                  <p className="font-medium text-gray-800">
                    {report.userProfile?.gender || "Not provided"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 mb-1">Ethnicity</p>
                  <p className="font-medium text-gray-800">
                    {report.userProfile?.ethnicity || "Not provided"}
                  </p>
                </div>
              </div>
            </div>

            {/* Wallet & Spending */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-linear-to-br from-blue-50 to-cyan-50 rounded-xl shadow-sm border border-blue-100 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Wallet className="w-5 h-5 text-blue-600" />
                  <h4 className="text-lg font-semibold text-gray-800">
                    Wallet Balance
                  </h4>
                </div>
                <p className="text-3xl font-bold text-blue-600">
                  ${report.userProfile?.walletBalance?.toLocaleString() || 0}
                </p>
              </div>

              <div className="bg-linear-to-br from-orange-50 to-red-50 rounded-xl shadow-sm border border-orange-100 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingDown className="w-5 h-5 text-orange-600" />
                  <h4 className="text-lg font-semibold text-gray-800">
                    Total Spent
                  </h4>
                </div>
                <p className="text-3xl font-bold text-orange-600">
                  ${report.userProfile?.netSpent?.toLocaleString() || 0}
                </p>
              </div>
            </div>

            {/* Bio */}
            {report.userProfile?.bio && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-3">
                  Bio
                </h4>
                <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                  {report.userProfile?.bio}
                </p>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default UserDetailsModal;
