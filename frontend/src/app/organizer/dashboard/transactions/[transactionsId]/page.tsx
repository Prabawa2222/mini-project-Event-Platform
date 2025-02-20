"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useOrganizer } from "@/context/organizer/OrganizerContext";
import { useToast } from "@/hooks/use-toast";
import { transactionService } from "@/utils/api/organizer/transactions";
import { formatDate, getStatusStyle } from "@/lib/utils";
import { TransactionPreview } from "@/types/transaction";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Link from "next/link";

const TransactionsIdOrganizerPage = () => {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { organizerId } = useOrganizer();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");

  const transactionId = params?.transactionsId
    ? parseInt(params.transactionsId as string, 10)
    : null;

  useEffect(() => {
    console.log("Updated previewUrl:", previewUrl);
  }, [previewUrl]);

  const {
    data: transaction,
    isLoading,
    error,
  } = useQuery<TransactionPreview>({
    queryKey: ["transaction", transactionId],
    queryFn: async () => {
      if (!transactionId) throw new Error("No transaction ID provided");
      const data = await transactionService.getTransactionById(transactionId);
      return {
        ...data,
        coupon: data.coupon ? data.coupon.code : null,
        promotion: data.promotion ? data.promotion : null,
      } as TransactionPreview;
    },
    enabled: !!transactionId && !isNaN(transactionId),
  });

  const approveMutation = useMutation({
    mutationFn: () =>
      transactionService.approveTransaction(
        transactionId as number,
        organizerId as string
      ),
    onSuccess: (data) => {
      setPreviewUrl(data.emailPreviewUrl ?? null);
      console.log("previewUrl", previewUrl);
      queryClient.invalidateQueries({
        queryKey: ["transaction", transactionId],
      });
      toast({
        title: "Success",
        description: "Transaction approved successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: () =>
      transactionService.rejectTransaction(
        transactionId as number,
        organizerId as string,
        rejectionReason
      ),
    onSuccess: (data) => {
      // Handle email preview URL just like in approveMutation
      setPreviewUrl(data.emailPreviewUrl ?? null);
      console.log("previewUrl", previewUrl);

      queryClient.invalidateQueries({
        queryKey: ["transaction", transactionId],
      });
      toast({
        title: "Success",
        description: "Transaction rejected successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <Card className="mx-4 md:mx-8 max-w-[980px] w-full">
      <CardHeader className="space-y-4 p-4 md:p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle className="text-xl md:text-2xl font-bold">
              Transaction Details
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Transaction #{transactionId}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            {previewUrl && (
              <Button
                variant="outline"
                onClick={() => router.push(`${previewUrl}`)}
                className="w-full sm:w-auto"
              >
                Link Email
              </Button>
            )}
            <Button
              variant="outline"
              onClick={() => router.push("/organizer/dashboard/transactions")}
              className="w-full sm:w-auto"
            >
              Back to Transactions
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 md:p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {/* Customer Information */}
          <Card>
            <CardHeader className="p-4">
              <CardTitle className="text-lg">Customer Information</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              <div>
                <strong>Name:</strong>
                <p className="font-medium mt-1">{transaction?.user}</p>
              </div>
              <div>
                <strong>Coupon:</strong>
                <p className="font-medium mt-1">
                  {transaction?.coupon || "N/A"}
                </p>
              </div>
              <div>
                <strong>Promotion:</strong>
                <p className="font-medium mt-1">
                  {transaction?.promotion?.code || "N/A"}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Event Information */}
          <Card>
            <CardHeader className="p-4">
              <CardTitle className="text-lg">Event Information</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              <div>
                <strong>Event:</strong>
                <p className="font-medium mt-1">{transaction?.event}</p>
              </div>
              <div>
                <strong>Ticket Type:</strong>
                <p className="font-medium mt-1">{transaction?.ticketType}</p>
              </div>
              <div>
                <strong>Quantity:</strong>
                <p className="font-medium mt-1">{transaction?.quantity}</p>
              </div>
            </CardContent>
          </Card>

          {/* Payment Information */}
          <Card>
            <CardHeader className="p-4">
              <CardTitle className="text-lg">Payment Information</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              <div>
                <strong>Transaction Created:</strong>
                <p className="font-medium mt-1">
                  {transaction?.createdAt
                    ? formatDate(transaction.createdAt)
                    : ""}
                </p>
              </div>
              <div>
                <strong>Transaction Updated:</strong>
                <p className="font-medium mt-1">
                  {transaction?.updatedAt
                    ? formatDate(transaction.updatedAt)
                    : ""}
                </p>
              </div>
              <div>
                <strong>Total Price:</strong>
                <p className="font-medium mt-1">
                  Rp. {transaction?.totalPrice?.toLocaleString() ?? "0"}
                </p>
              </div>
              <div>
                <strong>Status:</strong>
                <p className="mt-1">
                  {transaction?.status && (
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusStyle(
                        transaction.status
                      )}`}
                    >
                      {transaction.status.replace(/_/g, " ")}
                    </span>
                  )}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Payment Proof */}
          <Card>
            <CardHeader className="p-4">
              <CardTitle className="text-lg">Payment Proof</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              {transaction?.paymentProof && (
                <img
                  src={transaction.paymentProof}
                  alt="Payment Proof"
                  className="w-full h-auto rounded-lg"
                />
              )}
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        {transaction?.status === "WAITING_FOR_ADMIN_CONFIRMATION" && (
          <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-4 mt-6">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="destructive" className="w-full sm:w-auto">
                  Reject Transaction
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Reject Transaction</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <label htmlFor="reason" className="block font-medium">
                      Rejection Reason
                    </label>
                    <Input
                      id="reason"
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      placeholder="Enter reason for rejection"
                    />
                  </div>
                  <Button
                    onClick={() => rejectMutation.mutate()}
                    disabled={!rejectionReason || rejectMutation.isPending}
                    className="w-full"
                  >
                    {rejectMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Rejecting...
                      </>
                    ) : (
                      "Confirm Rejection"
                    )}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <Button
              onClick={() => approveMutation.mutate()}
              disabled={approveMutation.isPending}
              className="w-full sm:w-auto"
            >
              {approveMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Approving...
                </>
              ) : (
                "Approve Transaction"
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TransactionsIdOrganizerPage;
