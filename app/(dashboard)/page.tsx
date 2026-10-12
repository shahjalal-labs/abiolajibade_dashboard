"use client";

import { MonthlyEarnings } from "@/components/overview/MonthlyEarnings";
import Overview from "@/components/overview/Overview";
import TopWorkers from "@/components/overview/TopWorkers";
import { WeeklyEarnings } from "@/components/overview/WeeklyEarnings";
import { JWTDecodeToken } from "@/lib/jwtDecode";
import { useEarningSummaryQuery } from "@/redux/api/jobApi";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const [type, setType] = useState("monthly");
  const {data, isLoading, isError} = useEarningSummaryQuery(type);
  const { decoded }: any = JWTDecodeToken();
  const router = useRouter();
  // useEffect(() => {
  //   if (!decoded?.role || decoded?.role !== "Admin") {
  //     router.replace("/login");
  //   }
  // }, [decoded, router]);
  return (
    <div>
     <Overview></Overview>
       <div className="grid grid-cols-3 mt-8 gap-8">
        <div className="col-span-3 lg:col-span-2">
          {type == "monthly" ? (
            <MonthlyEarnings
              setType={setType}
              chartData={data?.result?.chartData}
            ></MonthlyEarnings>
          ) : (
            <WeeklyEarnings
              setType={setType}
              chartData={data?.result?.chartData}
            ></WeeklyEarnings>
          )}
        </div>
        <div className="col-span-3 lg:col-span-1">
        <TopWorkers></TopWorkers>
        </div>
      </div>
    </div>
  );
}
