"use client";

import { useOverviewQuery } from "@/redux/api/jobApi";
import { BookOpen, TrendingUp, Users, Briefcase } from "lucide-react";

const Overview = () => {
  const { data, isLoading, isError } = useOverviewQuery("");
 

  return (
    <div className="w-full py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {/* Total Bookings Card */}
          <div className="bg-linear-to-br from-indigo-50 to-purple-100 rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow border border-indigo-200 group cursor-pointer flex items-center justify-between">
          <div className="flex-1">
            <h3 className="text-sm font-medium text-gray-600 mb-2">
              Total Users
            </h3>
            <p className="text-3xl font-bold text-indigo-600">
              {data?.result?.totalUsers}
            </p>
            <p className="text-xs text-gray-500 mt-2">Active users</p>
          </div>
          <div className="bg-indigo-500 p-4 rounded-lg group-hover:scale-110 transition-transform ml-4 shrink-0">
            <Users className="w-8 h-8 text-white" />
          </div>
        </div>

        {/* Total Workers Card */}
        <div className="bg-linear-to-br from-orange-50 to-red-100 rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow border border-orange-200 group cursor-pointer flex items-center justify-between">
          <div className="flex-1">
            <h3 className="text-sm font-medium text-gray-600 mb-2">
              Total Workers
            </h3>
            <p className="text-3xl font-bold text-red-600">
              {data?.result?.totalWorkers}
            </p>
            <p className="text-xs text-gray-500 mt-2">Service providers</p>
          </div>
          <div className="bg-red-500 p-4 rounded-lg group-hover:scale-110 transition-transform ml-4 shrink-0">
            <Briefcase className="w-8 h-8 text-white" />
          </div>
        </div>
        <div className="bg-linear-to-br from-blue-50 to-blue-100 rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow border border-blue-200 group cursor-pointer flex items-center justify-between">
          <div className="flex-1">
            <h3 className="text-sm font-medium text-gray-600 mb-2">
              Total Bookings
            </h3>
            <p className="text-3xl font-bold text-blue-600">
              {data?.result?.totalBookings}
            </p>
            <p className="text-xs text-gray-500 mt-2">All-time bookings</p>
          </div>
          <div className="bg-blue-500 p-4 rounded-lg group-hover:scale-110 transition-transform ml-4 shrink-0">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
        </div>

        {/* Total Earnings Card */}
        <div className="bg-linear-to-br from-green-50 to-emerald-100 rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow border border-green-200 group cursor-pointer flex items-center justify-between">
          <div className="flex-1">
            <h3 className="text-sm font-medium text-gray-600 mb-2">
              Total Earnings
            </h3>
            <p className="text-3xl font-bold text-green-600">
              ${data?.result?.adminEarnings}
            </p>
            <p className="text-xs text-gray-500 mt-2">Platform revenue</p>
          </div>
          <div className="bg-green-500 p-4 rounded-lg group-hover:scale-110 transition-transform ml-4 shrink-0">
            <TrendingUp className="w-8 h-8 text-white" />
          </div>
        </div>

        {/* Total Users Card */}
      
      </div>
    </div>
  );
};

export default Overview;
