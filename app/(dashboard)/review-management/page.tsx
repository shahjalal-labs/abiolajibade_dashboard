"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import WorkerReviews from "./components/WorkerReviews";
import UserReviews from "./components/UserReviews";

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
        <h1 className="md:text-xl font-medium">Review Management</h1>
        <button
          onClick={() => setActive(!active)}
          className=" bg-bprimary text-white cursor-pointer text-xs md:text-[16px] px-2 md:px-4 py-2 rounded-[6px]"
        >
          {active ? "View Worker To User Reviews" : "View User To Worker Reviews"}
        </button>
      </div>
      {active == true ? (
        <UserReviews></UserReviews>
      ) : (
        <WorkerReviews></WorkerReviews>
      )}
    </div>
  );
};

export default Page;
