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
                <TableCell>{formatDate(transaction.transactionDate)}</TableCell>
                <TableCell>
                  {new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                  }).format(transaction.totalPrice)}
                </TableCell>
                <TableCell>
                  <Badge
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusStyle(
                      transaction.status
                    )}`}
                  >
                    {transaction.status?.replace(/_/g, " ")}
                  </Badge>
                </TableCell>
                <td className="p-4 space-x-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/events/${transaction.eventId}`}>
                      View Event
                    </Link>
                  </Button>
                  {transaction.status === "WAITING_FOR_PAYMENT" && (
                    <Button variant="default" size="sm" asChild>
                      <Link
                        href={`/customer/transactions/${transaction.id}/upload-payment`}
                      >
                        Upload Payment
                      </Link>
                    </Button>
                  )}
                </td>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default CustomerTransactionsPage;
