"use client";

import { FaSort } from "react-icons/fa";
import { useState } from "react";

const SortButton: React.FC<{ onSort: (order: string) => void }> = ({
  onSort,
}) => {
  const [sortOrder, setSortOrder] = useState("asc");

  const toggleSortOrder = () => {
    const newSortOrder = sortOrder === "asc" ? "desc" : "asc";
    setSortOrder(newSortOrder);
    onSort(newSortOrder);
  };

  return (
    <button
      onClick={toggleSortOrder}
      className="flex items-center gap-2 border-2 border-blue-500 text-blue-500 px-4 py-1 rounded-lg hover:bg-blue-100"
    >
      <FaSort />
      <span className="font-medium">
        Sort By Price ({sortOrder === "asc" ? "Low to High" : "High to Low"})
      </span>
    </button>
  );
};

export default SortButton;
