import React from "react";

const SkeletonCard = () => {
  return (
    <div className="p-4">
      <div className="w-full max-w-[320px] bg-white rounded-lg shadow-lg hover:shadow-2xl transition-all transform hover:scale-105 overflow-hidden cursor-pointer relative">
        {/* Image Section Skeleton */}
        <div className="relative w-full h-[180px] bg-gray-300 animate-pulse rounded-t-lg"></div>

        {/* Card Content Skeleton */}
        <div className="p-4 flex flex-col gap-3 h-[270px]">
          {/* Date Section Skeleton */}
          <div className="flex flex-col items-start bg-gradient-to-r from-blue-500 to-blue-300 text-white p-2 rounded-md">
            <div className="w-16 h-4 bg-gray-200 animate-pulse rounded"></div>
          </div>

          {/* Event Title Skeleton */}
          <div className="w-full h-5 bg-gray-200 animate-pulse rounded-md mt-3"></div>

          {/* Description Skeleton */}
          <div className="w-3/4 h-4 bg-gray-200 animate-pulse rounded-md mt-2"></div>
          <div className="w-2/3 h-4 bg-gray-200 animate-pulse rounded-md mt-2"></div>

          {/* Location & Price Skeleton */}
          <div className="flex flex-col gap-4">
            <div className="w-2/3 h-4 bg-gray-200 animate-pulse rounded-md mt-2"></div>
            <div className="w-1/3 h-5 bg-gray-200 animate-pulse rounded-md mt-2"></div>
          </div>

          {/* View Details Button Skeleton */}
          <div className="flex-grow flex items-end justify-end mt-2">
            <div className="w-24 h-5 bg-gray-200 animate-pulse rounded-md"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonCard;
