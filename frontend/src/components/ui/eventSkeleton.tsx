export const EventTableSkeleton = () => {
  return (
    <div className="w-full">
      <div className="border-b pb-4 mb-4">
        <div className="grid grid-cols-5 gap-4">
          {[...Array(5)].map((_, index) => (
            <div
              key={index}
              className="h-6 bg-gray-200 rounded animate-pulse"
            />
          ))}
        </div>
      </div>
      {[...Array(5)].map((_, rowIndex) => (
        <div key={rowIndex} className="border-b py-4">
          <div className="grid grid-cols-5 gap-4">
            {[...Array(4)].map((_, colIndex) => (
              <div
                key={colIndex}
                className="h-4 bg-gray-200 rounded animate-pulse"
              />
            ))}
            {/* Actions column */}
            <div className="flex gap-2">
              {[...Array(3)].map((_, btnIndex) => (
                <div
                  key={btnIndex}
                  className="w-8 h-8 bg-gray-200 rounded animate-pulse"
                />
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
