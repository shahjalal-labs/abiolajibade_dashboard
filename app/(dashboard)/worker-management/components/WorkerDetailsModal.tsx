"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { useWorkerDetailsQuery } from "@/redux/api/authApi";
import { Star } from "lucide-react";

interface WorkerDetailsModalProps {
  id: string;
}

const WorkerDetailsModal = ({ id }: WorkerDetailsModalProps) => {
  const { data: worker, isLoading, isError } = useWorkerDetailsQuery(id);

  const report = worker?.result;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="bg-blue-50 cursor-pointer text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-100 transition">
          View Worker Details
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-4xl max-h-[85vh] overflow-auto bg-white rounded-lg p-6">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between gap-3 text-xl font-semibold text-gray-800">
            Worker Details
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <p className="text-sm text-gray-500 mt-4">Loading details…</p>
        ) : isError ? (
          <p className="text-sm text-gray-500 mt-4">
            Error fetching worker details
          </p>
        ) : !report ? (
          <p className="text-sm text-gray-500 mt-4">No worker details found</p>
        ) : (
          <div className="flex flex-col gap-6 mt-4">
            {/* Profile Header Section */}
            <div className="md:flex items-center gap-2 md:gap-6 bg-linear-to-r from-blue-50 to-indigo-50 rounded-xl p-2 md:p-6 border border-blue-100">
              <div className="relative">
                <img
                  src={report?.profileImage}
                  alt={`${report?.userName}'s profile`}
                  className="rounded-full w-24 h-24 object-cover border-4 border-white shadow-md"
                />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-800">
                  {report?.userName}
                </h3>
                <p className="text-gray-600 text-sm mt-1">{report?.email}</p>
                <div className="flex items-center gap-4 mt-3">
                  <div className="flex items-center gap-1 bg-white px-3 py-1.5 rounded-full shadow-sm">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold text-gray-800">
                      {report?.avgRating}
                    </span>
                    <span className="text-gray-500 text-sm">
                      ({report?.totalReview} reviews)
                    </span>
                  </div>
                  <Badge variant="outline" className="bg-white">
                    ${report?.workerProfile?.hourlyRate}/hr
                  </Badge>
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
                    {report?.workerProfile?.age} years
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 mb-1">Gender</p>
                  <p className="font-medium text-gray-800">
                    {report?.workerProfile?.gender || "Not provided"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 mb-1">Ethnicity</p>
                  <p className="font-medium text-gray-800">
                    {report?.workerProfile?.ethnicity || "Not provided"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 mb-1">Language</p>
                  <p className="font-medium text-gray-800">
                    {report?.workerProfile?.language || "Not provided"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 mb-1">Experience</p>
                  <p className="font-medium text-gray-800">
                    {report?.workerProfile?.experience} years
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 mb-1">Disability Status</p>
                  <p className="font-medium text-gray-800">
                    {report?.workerProfile?.disability ? "Yes" : "No"}
                  </p>
                </div>
              </div>
            </div>

            {/* Earnings & Skills */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-linear-to-br from-green-50 to-emerald-50 rounded-xl shadow-sm border border-green-100 p-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">
                  Earnings
                </h4>
                <div className="space-y-3">
                  <div>
                    <p className="text-gray-600 text-sm mb-1">
                      Current Earning
                    </p>
                    <p className="text-2xl font-bold text-green-600">
                      ${report?.workerProfile?.currentEarning}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm mb-1">
                      All Time Earning
                    </p>
                    <p className="text-xl font-semibold text-gray-800">
                      ${report?.workerProfile?.allTimeEarning}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-2 md:p-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">
                  Skills
                </h4>
                <div className="flex flex-wrap gap-2">
                  {report.workerProfile?.skills?.map(
                    (skill: string, index: number) => (
                      <Badge
                        key={index}
                        className="bg-blue-100 text-blue-700 hover:bg-blue-200"
                      >
                        {skill}
                      </Badge>
                    ),
                  )}
                </div>
              </div>
            </div>

            {/* Bio */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h4 className="text-lg font-semibold text-gray-800 mb-3">Bio</h4>
              <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                {report?.workerProfile?.bio || "No bio provided"}
              </p>
            </div>

            {/* License Information */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">
                License Information
              </h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500 mb-1">License Number</p>
                  <p className="font-medium text-gray-800">
                    {report?.workerProfile?.licenceNumber || "Not provided"}
                  </p>
                </div>
              </div>
            </div>

            {/* Certificates & Documents */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">
                Certificates & Documents
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Certificate */}
                <div>
                  <p className="font-medium text-gray-700 mb-3">Certificate</p>
                  {report?.workerProfile?.certificateUrl ? (
                    <div className="relative h-48 w-full rounded-lg overflow-hidden bg-gray-50 border border-gray-300 shadow-sm">
                      <Image
                        src={report?.workerProfile?.certificateUrl}
                        alt="Worker Certificate"
                        fill
                        className="object-contain p-2"
                      />
                    </div>
                  ) : (
                    <div className="h-48 w-full rounded-lg bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center">
                      <p className="text-gray-500 text-sm">Not provided</p>
                    </div>
                  )}
                </div>

                {/* CPR Certificate */}
                <div>
                  <p className="font-medium text-gray-700 mb-3">
                    CPR Certificate
                  </p>
                  {report?.workerProfile?.cprUrl ? (
                    <div className="relative h-48 w-full rounded-lg overflow-hidden bg-gray-50 border border-gray-300 shadow-sm">
                      <Image
                        src={report?.workerProfile?.cprUrl}
                        alt="CPR Certificate"
                        fill
                        className="object-contain p-2"
                      />
                    </div>
                  ) : (
                    <div className="h-48 w-full rounded-lg bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center">
                      <p className="text-gray-500 text-sm">Not provided</p>
                    </div>
                  )}
                </div>

                {/* License */}
                <div>
                  <p className="font-medium text-gray-700 mb-3">License</p>
                  {report?.workerProfile?.licenceUrl ? (
                    <div className="relative h-48 w-full rounded-lg overflow-hidden bg-gray-50 border border-gray-300 shadow-sm">
                      <Image
                        src={report?.workerProfile?.licenceUrl}
                        alt="License"
                        fill
                        className="object-contain p-2"
                      />
                    </div>
                  ) : (
                    <div className="h-48 w-full rounded-lg bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center">
                      <p className="text-gray-500 text-sm">Not provided</p>
                    </div>
                  )}
                </div>

                {/* Immunization Certificate */}
                <div>
                  <p className="font-medium text-gray-700 mb-3">
                    Immunization Certificate
                  </p>
                  {report?.workerProfile?.immunizationUrl ? (
                    <div className="relative h-48 w-full rounded-lg overflow-hidden bg-gray-50 border border-gray-300 shadow-sm">
                      <Image
                        src={report?.workerProfile?.immunizationUrl}
                        alt="Immunization Certificate"
                        fill
                        className="object-contain p-2"
                      />
                    </div>
                  ) : (
                    <div className="h-48 w-full rounded-lg bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center">
                      <p className="text-gray-500 text-sm">Not provided</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default WorkerDetailsModal;
