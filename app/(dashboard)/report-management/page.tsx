"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import UserReports from "./components/UserReports";
import WorkerReports from "./components/WorkerReports";

const Page = () => {
  const searchParams = useSearchParams();
  const view = searchParams.get("view");
  const [active, setActive] = useState(true);

  useEffect(() => {
    if (view === "applications") {
      setActive(false);
    }
  }, [view]);
  return (
    <div>
      <div className="flex items-center pb-5 justify-between">
        <h1 className="md:text-xl font-medium">Report Management</h1>
        <button
          onClick={() => setActive(!active)}
          className=" bg-bprimary text-white cursor-pointer text-xs md:text-[16px] px-2 md:px-4 py-2 rounded-[6px]"
        >
          {active ? "View Worker Reports" : "View User Reports"}
        </button>
      </div>
      {active == true ? (
        <UserReports></UserReports>
      ) : (
        <WorkerReports></WorkerReports>
      )}
    </div>
  );
};

export default Page;
