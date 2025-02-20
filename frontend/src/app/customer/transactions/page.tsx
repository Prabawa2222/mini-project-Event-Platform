"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { transactionService } from "@/utils/api/customer/transactions";
import { useUser } from "@/context/user/UserContext";
import { formatDate, getStatusStyle } from "@/lib/utils";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { FileX } from "lucide-react";

interface Transaction {
  id: number;
  event: string;
  transactionDate: string;
  status: string[];
  totalPrice: number;
}

interface TransactionResponse {
  data: Transaction[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-12 text-center">
    <FileX className="w-12 h-12 text-gray-400 mb-4" />
    <h3 className="text-lg font-medium text-gray-900 mb-1">No Transactions</h3>
    <p className="text-sm text-gray-500 mb-4">
      You haven't made any transactions yet.
    </p>
  </div>
);

const CustomerTransactionsPage = () => {
  const { userId } = useUser();
  const [page, setPage] = useState(1);
  const [limit] = useState(5);

  const {
    data: transactions,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["transactions", userId, page],
    queryFn: () =>
      transactionService.getTransactionsByUserId(userId as string, page, limit),
    enabled: !!userId,
  });

  return (
    <Card className="p-6 space-y-6 mx-8">
      <CardHeader>
        <CardTitle>My Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        {transactions?.data.length < 1 ? (
          <EmptyState />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Event</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Total Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions?.data.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="font-medium">
                    {transaction.event}
                  </TableCell>
                  <TableCell>
                    {formatDate(transaction.transactionDate)}
                  </TableCell>
                  <TableCell>
                    {new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                    }).format(transaction.totalPrice)}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusStyle(
                        transaction.status[0] || ""
                      )}`}
                    >
                      {transaction.status[0]?.replace(/_/g, " ")}
                    </Badge>
                  </TableCell>
                  <TableCell className="p-4 space-x-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/events/${transaction.eventId}`}>
                        View Event
                      </Link>
                    </Button>
                    {transaction.status[0] === "WAITING_FOR_PAYMENT" && (
                      <Button variant="default" size="sm" asChild>
                        <Link
                          href={`/customer/transactions/${transaction.id}/upload-payment`}
                        >
                          Upload Payment
                        </Link>
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default CustomerTransactionsPage;
