import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const SummaryCardSkeleton = () => (
  <Card>
    <CardHeader className="pb-2">
      <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
    </CardHeader>
    <CardContent>
      <div className="h-8 w-32 bg-gray-200 rounded animate-pulse" />
    </CardContent>
  </Card>
);

const TransactionTableSkeleton = () => (
  <div className="overflow-auto rounded-md border">
    <div className="min-w-full align-middle">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-muted/50">
          <tr>
            {[...Array(8)].map((_, index) => (
              <th
                key={index}
                scope="col"
                className="px-3 py-4 text-left text-xs font-medium sm:px-4"
              >
                <div className="h-3 w-16 bg-gray-200 rounded animate-pulse" />
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200 bg-white">
          {[...Array(5)].map((_, rowIndex) => (
            <tr key={rowIndex}>
              {[...Array(8)].map((_, colIndex) => (
                <td
                  key={colIndex}
                  className="whitespace-nowrap px-3 py-4 text-sm sm:px-4"
                >
                  <div
                    className={`h-4 bg-gray-200 rounded animate-pulse ${
                      colIndex === 6 ? "w-16" : "w-24"
                    }`}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const TransactionsDashboardSkeleton = () => {
  return (
    <Card className="p-4 md:p-6 space-y-4 md:space-y-6 w-full max-w-[980px] mx-auto px-2 md:px-8">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
      </CardHeader>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {[...Array(4)].map((_, index) => (
          <SummaryCardSkeleton key={index} />
        ))}
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">All Transactions</TabsTrigger>
          <TabsTrigger value="pending">Pending Approval</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <Card>
            <CardHeader>
              <div className="h-6 w-36 bg-gray-200 rounded animate-pulse" />
            </CardHeader>
            <CardContent>
              <TransactionTableSkeleton />

              <div className="mt-4 flex justify-center">
                <div className="flex gap-2">
                  {[...Array(5)].map((_, index) => (
                    <div
                      key={index}
                      className="h-8 w-8 bg-gray-200 rounded animate-pulse"
                    />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pending">
          <Card>
            <CardHeader>
              <div className="h-6 w-36 bg-gray-200 rounded animate-pulse" />
            </CardHeader>
            <CardContent>
              <TransactionTableSkeleton />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default TransactionsDashboardSkeleton;
