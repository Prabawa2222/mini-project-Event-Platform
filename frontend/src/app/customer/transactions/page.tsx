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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { transactionService } from "@/utils/api/customer/transactions";
import { reviewService } from "@/utils/api/customer/reviews";
import { useUser } from "@/context/user/UserContext";
import { formatDate, getStatusStyle } from "@/lib/utils";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const CustomerTransactionsPage = () => {
  const { userId } = useUser();
  const [page, setPage] = useState(1);
  const [reviewModal, setReviewModal] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const queryClient = useQueryClient();

  // Fetch transactions
  const { data: transactions, isLoading } = useQuery({
    queryKey: ["transactions", String(userId), page],
    queryFn: () =>
      transactionService.getTransactionsByUserId(String(userId), page, 5),
    enabled: !!userId,
  });

  // Submit review mutation
  const reviewMutation = useMutation({
    mutationFn: async () => {
      if (!userId) return;
      if (rating < 1 || rating > 5)
        throw new Error("Rating must be between 1 and 5");

      await reviewService.createReview(Number(userId), 1, rating, comment);
    },
    onSuccess: () => {
      setReviewModal(false);
      setComment("");
      setRating(5);
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
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
                    {transaction.status.replace(/_/g, " ")}
                  </Badge>
                </TableCell>
                <TableCell className="p-4 space-x-2">
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
                  {transaction.status === "DONE" && (
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => setReviewModal(true)}
                    >
                      Review
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>

      {/* Modal Review */}
      {reviewModal && (
        <Dialog open={reviewModal} onOpenChange={setReviewModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Review Event</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Label>Rating (1-5)</Label>
              <Input
                type="number"
                min="1"
                max="5"
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
              />
              <Label>Comment</Label>
              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Write your review..."
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setReviewModal(false)}>
                Cancel
              </Button>
              <Button
                variant="default"
                onClick={() => reviewMutation.mutate()}
                disabled={reviewMutation.isPending}
              >
                {reviewMutation.isPending ? "Submitting..." : "Submit Review"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </Card>
  );
};

export default CustomerTransactionsPage;
