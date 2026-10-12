"use client";

import { useTopWorkersQuery } from "@/redux/api/jobApi";
import { Star, Briefcase } from "lucide-react";
import Link from "next/link";

const TopWorkers = () => {
  const { data: workers, isLoading, isError } = useTopWorkersQuery("");
 
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Top Workers</h2>
        <div className="text-center text-gray-500">Loading top workers...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Top Workers</h2>
        <div className="text-center text-red-500">Error fetching workers</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-4 border border-gray-200">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-xl font-bold text-gray-800 ">Top Workers</h2>
        <Link href="/worker-management" className="underline text-blue-600">View All</Link>
      </div>

      {!workers?.result || workers.result.length === 0 ? (
        <div className="text-center text-gray-500 py-8">No workers found</div>
      ) : (
        <>
          <div className="space-y-4">
            {workers.result.map((worker: any, index: number) => (
              <div
                key={worker.id}
                className="flex items-center gap-4 p-4 rounded-lg bg-linear-to-r from-gray-50 to-blue-50 border border-gray-200 hover:shadow-md transition-shadow group cursor-pointer"
              >
                {/* Profile Image */}
                <div className="shrink-0">
                  <img
                    src={worker?.profileImage}
                    alt={worker.userName}
                    className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm group-hover:scale-105 transition-transform"
                  />
                </div>

                {/* Worker Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-800 truncate">
                    {worker?.userName}
                  </h3>
                  <div className="flex items-center gap-3 mt-1">
                    <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-md">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-semibold text-gray-700">
                        {worker?.avgRating}
                      </span>
                      <span className="text-xs text-gray-500">
                        ({worker?.totalReview})
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-600">
                      <Briefcase className="w-4 h-4 text-blue-500" />
                      <span className="text-sm">
                        {worker?._count?.workerBookings} bookings
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default TopWorkers;
