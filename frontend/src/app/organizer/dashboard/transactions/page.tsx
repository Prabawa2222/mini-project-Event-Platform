"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/dataTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useOrganizer } from "@/context/organizer/OrganizerContext";
import { transactionService } from "@/lib/api/transactions";
import { getStatusStyle } from "@/lib/utils";
import { TransactionPreview, TransactionSummary } from "@/types/transaction";
import { useQuery } from "@tanstack/react-query";

import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React, { useState } from "react";

const TransactionsOrganizerPage = () => {
  const { organizerId } = useOrganizer();

  const { data: transactions, isLoading: isLoadingTransactions } = useQuery({
    queryKey: ["transactions", organizerId],
    queryFn: () =>
      transactionService.getTransactionsByOrganizerId(organizerId as string),
    enabled: !!organizerId,
  });

  const { data: pendingTransactions, isLoading: isLoadingPending } = useQuery({
    queryKey: ["pendingTransactions", organizerId],
    queryFn: () =>
      transactionService.getPendingTransactionsByOrganizerId(
        organizerId as string
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

  const isLoading =
    isLoadingTransactions || isLoadingPending || isLoadingSummary;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <Card className="p-6 space-y-6 w-[980px] mx-8">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-2xl font-bold">
          Transactions Management
        </CardTitle>
      </CardHeader>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              ${summary?.overallSummary.totalRevenue.toLocaleString() ?? 0}
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
              <div className="rounded-md border">
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
                    {transactions?.map((transaction) => (
                      <tr key={transaction.id} className="border-b">
                        <td className="p-4">#{transaction.id}</td>
                        <td className="p-4">{transaction.user.name}</td>
                        <td className="p-4">{transaction.event.name}</td>
                        <td className="p-4">{transaction.ticketType.name}</td>
                        <td className="p-4">{transaction.quantity}</td>
                        <td className="p-4">
                          ${transaction.totalPrice.toLocaleString()}
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusStyle(
                              transaction.status
                            )}`}
                          >
                            {transaction.status?.replace(/_/g, " ")}
                          </span>
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
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pending">
          <Card>
            <CardHeader>
              <CardTitle>Pending Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
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
                    {pendingTransactions?.map((transaction) => (
                      <tr key={transaction.id} className="border-b">
                        <td className="p-4">#{transaction.id}</td>
                        <td className="p-4">{transaction.user.name}</td>
                        <td className="p-4">{transaction.event}</td>
                        <td className="p-4">{transaction.ticketType}</td>
                        <td className="p-4">{transaction.quantity}</td>
                        <td className="p-4">
                          ${transaction.totalPrice.toLocaleString()}
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
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default TransactionsOrganizerPage;
