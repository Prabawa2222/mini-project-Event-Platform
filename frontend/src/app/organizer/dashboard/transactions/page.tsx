"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/dataTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useOrganizer } from "@/context/organizer/OrganizerContext";
import { transactionService } from "@/utils/api/organizer/transactions";
import { getStatusStyle } from "@/lib/utils";
import { TransactionPreview, TransactionSummary } from "@/types/transaction";
import { useQuery } from "@tanstack/react-query";

import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React, { useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const TransactionsOrganizerPage = () => {
  const { organizerId } = useOrganizer();
  const [page, setPage] = useState(1);
  const [limit] = useState(5);

  const { data: transactions, isLoading: isLoadingTransactions } = useQuery({
    queryKey: ["transactions", organizerId, page],
    queryFn: () =>
      transactionService.getTransactionsByOrganizerId(
        organizerId as string,
        page,
        limit
      ),
    enabled: !!organizerId,
  });

  const { data: pendingTransactions, isLoading: isLoadingPending } = useQuery({
    queryKey: ["pendingTransactions", organizerId, page],
    queryFn: () =>
      transactionService.getPendingTransactionsByOrganizerId(
        organizerId as string,
        page,
        limit
      ),
    enabled: !!organizerId,
  });

  const { data: summary, isLoading: isLoadingSummary } = useQuery({
    queryKey: ["transactionsSummary", organizerId],
    queryFn: () =>
      transactionService.getTransactionsSummaryByOrganizerId(
        organizerId as string
      ),
    enabled: !!organizerId,
  });

  // console.log("All Transactions data:", transactions);
  // console.log("Pending Transactions data:", pendingTransactions);

  const isLoading =
    isLoadingTransactions || isLoadingPending || isLoadingSummary;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <Card className="p-4 md:p-6 space-y-4 md:space-y-6 w-full max-w-[980px] mx-auto px-2 md:px-8">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-2xl font-bold">
          Transactions Management
        </CardTitle>
      </CardHeader>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              Rp {summary?.overallSummary.totalRevenue.toLocaleString() ?? 0}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Total Transactions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {summary?.overallSummary.totalTransactions.toLocaleString() ?? 0}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Total Tickets Sold
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {summary?.overallSummary.totalTicketsSold.toLocaleString() ?? 0}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Approvals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {pendingTransactions?.length ?? 0}
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">All Transactions</TabsTrigger>
          <TabsTrigger value="pending">Pending Approval</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>All Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-auto rounded-md border">
                <div className="min-w-full align-middle">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-muted/50">
                      <tr>
                        <th
                          scope="col"
                          className="px-3 py-4 text-left text-xs font-medium sm:px-4"
                        >
                          ID
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-4 text-left text-xs font-medium sm:px-4"
                        >
                          Customer
                        </th>
                        <th
                          scope="col"
                          className="hidden px-3 py-4 text-left text-xs font-medium sm:table-cell sm:px-4"
                        >
                          Event
                        </th>
                        <th
                          scope="col"
                          className="hidden px-3 py-4 text-left text-xs font-medium sm:table-cell sm:px-4"
                        >
                          Type
                        </th>
                        <th
                          scope="col"
                          className="hidden px-3 py-4 text-left text-xs font-medium sm:table-cell sm:px-4"
                        >
                          Qty
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-4 text-left text-xs font-medium sm:px-4"
                        >
                          Price
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-4 text-left text-xs font-medium sm:px-4"
                        >
                          Status
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-4 text-left text-xs font-medium sm:px-4"
                        >
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {transactions?.map((transaction) => (
                        <tr key={transaction.id} className="hover:bg-gray-50">
                          <td className="whitespace-nowrap px-3 py-4 text-sm sm:px-4">
                            #{transaction.id}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm sm:px-4">
                            <div className="flex flex-col">
                              <span className="font-medium">
                                {transaction.user.name}
                              </span>
                              <span className="text-xs text-gray-500 sm:hidden">
                                {transaction.event.name}
                              </span>
                            </div>
                          </td>
                          <td className="hidden whitespace-nowrap px-3 py-4 text-sm sm:table-cell sm:px-4">
                            {transaction.event.name}
                          </td>
                          <td className="hidden whitespace-nowrap px-3 py-4 text-sm sm:table-cell sm:px-4">
                            {transaction.ticketType.name}
                          </td>
                          <td className="hidden whitespace-nowrap px-3 py-4 text-sm sm:table-cell sm:px-4">
                            {transaction.quantity}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm sm:px-4">
                            Rp {transaction.totalPrice.toLocaleString()}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm sm:px-4">
                            <Badge
                              className={`px-2 py-1 text-xs ${getStatusStyle(
                                transaction.status
                              )}`}
                            >
                              {transaction.status?.replace(/_/g, " ")}
                            </Badge>
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm sm:px-4">
                            <Button variant="outline" size="sm" asChild>
                              <Link
                                href={`/organizer/dashboard/transactions/${transaction.id}`}
                              >
                                View
                              </Link>
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="mt-4">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem className="hidden sm:inline-block">
                      <PaginationPrevious
                        onClick={() => handlePageChange(page - 1)}
                        className={
                          page === 1
                            ? "pointer-events-none opacity-50"
                            : "cursor-pointer"
                        }
                      />
                    </PaginationItem>

                    <PaginationItem>
                      <PaginationLink
                        onClick={() => handlePageChange(1)}
                        isActive={page === 1}
                      >
                        1
                      </PaginationLink>
                    </PaginationItem>

                    {page > 3 && (
                      <PaginationItem className="hidden sm:inline-block">
                        <PaginationEllipsis />
                      </PaginationItem>
                    )}

                    {page > 2 && (
                      <PaginationItem>
                        <PaginationLink
                          onClick={() => handlePageChange(page - 1)}
                        >
                          {page - 1}
                        </PaginationLink>
                      </PaginationItem>
                    )}

                    {page !== 1 &&
                      page !==
                        Math.ceil((transactions?.length || 0) / limit) && (
                        <PaginationItem>
                          <PaginationLink
                            onClick={() => handlePageChange(page)}
                            isActive={true}
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      )}

                    {page <
                      Math.ceil((transactions?.length || 0) / limit) - 1 && (
                      <PaginationItem>
                        <PaginationLink
                          onClick={() => handlePageChange(page + 1)}
                        >
                          {page + 1}
                        </PaginationLink>
                      </PaginationItem>
                    )}

                    {page <
                      Math.ceil((transactions?.length || 0) / limit) - 2 && (
                      <PaginationItem className="hidden sm:inline-block">
                        <PaginationEllipsis />
                      </PaginationItem>
                    )}

                    {Math.ceil((transactions?.length || 0) / limit) > 1 && (
                      <PaginationItem>
                        <PaginationLink
                          onClick={() =>
                            handlePageChange(
                              Math.ceil((transactions?.length || 0) / limit)
                            )
                          }
                          isActive={
                            page ===
                            Math.ceil((transactions?.length || 0) / limit)
                          }
                        >
                          {Math.ceil((transactions?.length || 0) / limit)}
                        </PaginationLink>
                      </PaginationItem>
                    )}

                    <PaginationItem className="hidden sm:inline-block">
                      <PaginationNext
                        onClick={() => handlePageChange(page + 1)}
                        className={
                          !transactions || transactions.length < limit
                            ? "pointer-events-none opacity-50"
                            : "cursor-pointer"
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pending">
          <Card>
            <CardHeader>
              <CardTitle>Pending Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-auto rounded-md border">
                <div className="min-w-full align-middle">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-muted/50">
                      <tr>
                        <th
                          scope="col"
                          className="px-3 py-4 text-left text-xs font-medium sm:px-4"
                        >
                          ID
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-4 text-left text-xs font-medium sm:px-4"
                        >
                          Customer
                        </th>
                        <th
                          scope="col"
                          className="hidden px-3 py-4 text-left text-xs font-medium sm:table-cell sm:px-4"
                        >
                          Event
                        </th>
                        <th
                          scope="col"
                          className="hidden px-3 py-4 text-left text-xs font-medium sm:table-cell sm:px-4"
                        >
                          Type
                        </th>
                        <th
                          scope="col"
                          className="hidden px-3 py-4 text-left text-xs font-medium sm:table-cell sm:px-4"
                        >
                          Qty
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-4 text-left text-xs font-medium sm:px-4"
                        >
                          Price
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-4 text-left text-xs font-medium sm:px-4"
                        >
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {pendingTransactions?.data.map((transaction) => (
                        <tr key={transaction.id} className="hover:bg-gray-50">
                          <td className="whitespace-nowrap px-3 py-4 text-sm sm:px-4">
                            #{transaction.id}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm sm:px-4">
                            <div className="flex flex-col">
                              <span className="font-medium">
                                {transaction.user.name}
                              </span>
                              <span className="text-xs text-gray-500 sm:hidden">
                                {transaction.event.name}
                              </span>
                            </div>
                          </td>
                          <td className="hidden whitespace-nowrap px-3 py-4 text-sm sm:table-cell sm:px-4">
                            {transaction.event.name}
                          </td>
                          <td className="hidden whitespace-nowrap px-3 py-4 text-sm sm:table-cell sm:px-4">
                            {transaction.ticketType.name}
                          </td>
                          <td className="hidden whitespace-nowrap px-3 py-4 text-sm sm:table-cell sm:px-4">
                            {transaction.quantity}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm sm:px-4">
                            Rp {transaction.totalPrice.toLocaleString()}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm sm:px-4">
                            <Button variant="outline" size="sm" asChild>
                              <Link
                                href={`/organizer/dashboard/transactions/${transaction.id}`}
                              >
                                View
                              </Link>
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default TransactionsOrganizerPage;
