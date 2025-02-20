import { FileX } from "lucide-react";

export const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-12 text-center">
    <FileX className="w-12 h-12 text-gray-400 mb-4" />
    <h3 className="text-lg font-medium text-gray-900 mb-1">No Transactions</h3>
    <p className="text-sm text-gray-500 mb-4">
      You haven't made any transactions yet.
    </p>
  </div>
);
