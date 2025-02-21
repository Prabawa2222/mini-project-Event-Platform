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
              <div className="rounded-md border overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr className="border-b">
                      <th className="h-12 px-4 text-left align-middle font-medium">
                        ID
                      </th>
                      <th className="h-12 px-4 text-left align-middle font-medium">
                        Customer
                      </th>
                      <th className="h-12 px-4 text-left align-middle font-medium">
                        Event
                      </th>
                      <th className="h-12 px-4 text-left align-middle font-medium">
                        Ticket Type
                      </th>
                      <th className="h-12 px-4 text-left align-middle font-medium">
                        Quantity
                      </th>
                      <th className="h-12 px-4 text-left align-middle font-medium">
                        Total Price
                      </th>
                      <th className="h-12 px-4 text-left align-middle font-medium">
                        Status
                      </th>
                      <th className="h-12 px-4 text-left align-middle font-medium">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions &&
                      transactions.map((transaction) => (
                        <tr key={transaction.id} className="border-b">
                          <td className="p-4 md:p-4">#{transaction.id}</td>
                          <td className="p-4 md:p-4">
                            {transaction.user.name}
                          </td>
                          <td className="p-4 md:p-4">
                            {transaction.event.name}
                          </td>
                          <td className="p-4 md:p-4">
                            {transaction.ticketType.name}
                          </td>
                          <td className="p-4 md:p-4">{transaction.quantity}</td>
                          <td className="p-4 md:p-4">
                            Rp {transaction.totalPrice.toLocaleString()}
                          </td>
                          <td className="p-4">
                            <Badge
                              className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusStyle(
                                transaction.status
                              )}`}
                            >
                              {transaction.status?.replace(/_/g, " ")}
                            </Badge>
                          </td>
                          <td className="p-4">
                            <Button variant="outline" size="sm" asChild>
                              <Link
                                href={`/organizer/dashboard/transactions/${transaction.id}`}
                              >
                                View Details
                              </Link>
                            </Button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-4">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => handlePageChange(page - 1)}
                        className={
                          page === 1
                            ? "pointer-events-none opacity-50"
                            : "cursor-pointer"
                        }
                      />
                    </PaginationItem>

                    {/* First Page */}
                    <PaginationItem>
                      <PaginationLink
                        onClick={() => handlePageChange(1)}
                        isActive={page === 1}
                      >
                        1
                      </PaginationLink>
                    </PaginationItem>

                    {/* Show ellipsis if there are many pages */}
                    {page > 3 && (
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                    )}

                    {/* Current page and surrounding pages */}
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

                    {/* Show ellipsis if there are many pages */}
                    {page <
                      Math.ceil((transactions?.length || 0) / limit) - 2 && (
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                    )}

                    {/* Last Page */}
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

                    <PaginationItem>
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
              <div className="rounded-md border overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr className="border-b">
                      <th className="h-12 px-4 text-left align-middle font-medium">
                        ID
                      </th>
                      <th className="h-12 px-4 text-left align-middle font-medium">
                        Customer
                      </th>
                      <th className="h-12 px-4 text-left align-middle font-medium">
                        Event
                      </th>
                      <th className="h-12 px-4 text-left align-middle font-medium">
                        Ticket Type
                      </th>
                      <th className="h-12 px-4 text-left align-middle font-medium">
                        Quantity
                      </th>
                      <th className="h-12 px-4 text-left align-middle font-medium">
                        Total Price
                      </th>
                      <th className="h-12 px-4 text-left align-middle font-medium">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingTransactions &&
                      pendingTransactions.data.map((transaction) => (
                        <tr key={transaction.id} className="border-b">
                          <td className="p-4">#{transaction.id}</td>
                          <td className="p-4">{transaction.user.name}</td>
                          <td className="p-4">{transaction.event.name}</td>
                          <td className="p-4">{transaction.ticketType.name}</td>
                          <td className="p-4">{transaction.quantity}</td>
                          <td className="p-4">
                            Rp {transaction.totalPrice.toLocaleString()}
                          </td>
                          <td className="p-4">
                            <Button variant="outline" size="sm" asChild>
                              <Link
                                href={`/organizer/dashboard/transactions/${transaction.id}`}
                              >
                                View Details
                              </Link>
                            </Button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-4">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => handlePageChange(page - 1)}
                        className={
                          page === 1
                            ? "pointer-events-none opacity-50"
                            : "cursor-pointer"
                        }
                      />
                    </PaginationItem>

                    {/* First Page */}
                    <PaginationItem>
                      <PaginationLink
                        onClick={() => handlePageChange(1)}
                        isActive={page === 1}
                      >
                        1
                      </PaginationLink>
                    </PaginationItem>

                    {/* Show ellipsis if there are many pages */}
                    {page > 3 && (
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                    )}

                    {/* Current page and surrounding pages */}
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

                    {/* Show ellipsis if there are many pages */}
                    {page <
                      Math.ceil((transactions?.length || 0) / limit) - 2 && (
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                    )}

                    {/* Last Page */}
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

                    <PaginationItem>
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
      </Tabs>
    </Card>
  );
};

export default TransactionsOrganizerPage;
