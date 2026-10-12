"use client";
import {  useState } from "react";
import AllWorkers from "./components/AllWorkers";

const WorkersPage = () => {
  const [active, setActive] = useState(true);

 
  return (
    <div>
      <div className="flex items-center pb-5 justify-between">
        <h1 className="md:text-xl font-medium">
          {active ? "Worker Management" : "Pending Workers"}
        </h1>
        {/* <button
          onClick={() => setActive(!active)}
          className=" bg-bprimary text-white cursor-pointer text-xs md:text-[16px] px-2 md:px-4 py-2 rounded-[6px]"
        >
          {active ? "Pending Workers" : "View Worker List"}
        </button> */}
      </div>
      {active == true ? (
        <AllWorkers></AllWorkers>
      ) : (
     "sdfsdfsfdsfsdfs"
      )}
    </div>
  );
};

export default WorkersPage;
