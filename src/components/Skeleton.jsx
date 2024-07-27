import React from "react";
import "../../src/index.css";

const shimmer =
  "shimmer mx-4 md:mx-20 py-8 rounded-xl bg-gray-100 p-2 shadow-sm";

export const BikeSkeleton = () => {
  return (
    <div className={shimmer}>
      <div className="flex  p-4">
        <div className="h-20 sm:h-28 w-20 sm:w-28 rounded-lg bg-gray-200 pulse" />
        <div className="flex flex-col">
          <div className="ml-4 md:ml-16 h-6 w-[80px] sm:w-[200px] rounded-md bg-gray-200 pulse" />
          <div className="ml-4 md:ml-16 h-4 w-[50px] sm:w-[80px] my-4 rounded-md bg-gray-200 pulse" />
          <div className="ml-4 md:ml-16 h-4 w-[50px] sm:w-[80px] rounded-md bg-gray-200 pulse" />
        </div>
        <div className="flex flex-col mt-6">
          <div className="ml-4 h-4 w-[50px] sm:w-[80px] my-4 rounded-md bg-gray-200 pulse" />
          <div className="ml-4 h-4 w-[50px] sm:w-[80px] rounded-md bg-gray-200 pulse" />
        </div>
      </div>
    </div>
  );
};

export function BikesPageSkeleton() {
  return (
    <div className="flex flex-col gap-16 mt-20 md:mx-10 lg:mx-28">
      <h1 className="flex w-full items-center justify-center text-2xl my-4 text-gray-400 font-bold">
        Please wait it will take sometimes ....
      </h1>
      <BikeSkeleton />
      <BikeSkeleton />
      <BikeSkeleton />
      <BikeSkeleton />
    </div>
  );
}
