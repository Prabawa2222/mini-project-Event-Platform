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
import React, { useState } from "react";

const TransactionsIdOrganizerPage = () => {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { organizerId } = useOrganizer();
  const [rejectionReason, setRejectionReason] = useState("");

  const transactionId = params?.transactionsId
    ? parseInt(params.transactionsId as string, 10)
    : null;

  const {
    data: transaction,
    isLoading,
    error,
  } = useQuery<TransactionPreview>({
    queryKey: ["transaction", transactionId],
    queryFn: async () => {
      if (!transactionId) throw new Error("No transaction ID provided");
      const data = await transactionService.getTransactionById(transactionId);
      return data;
    },
    enabled: !!transactionId && !isNaN(transactionId),
  });

  const approveMutation = useMutation({
    mutationFn: () =>
      transactionService.approveTransaction(
        transactionId as number,
        organizerId as string
      ),
    onSuccess: () => {
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
    onSuccess: () => {
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
    <Card className="p-6 space-y-6 w-[980px] mx-8">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div>
          <CardTitle className="text-2xl font-bold">
            Transaction Details
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Transaction #{transactionId}
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => router.push("/organizer/dashboard/transactions")}
        >
          Back to Transactions
        </Button>
      </CardHeader>

      <div className="grid grid-cols-2 gap-6">
        {/* Customer Information */}
        <Card>
          <CardHeader>
            <CardTitle>Customer Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <strong>Name:</strong>
              <p className="font-medium mt-1">{transaction?.user}</p>
            </div>
            <div>
              <strong>Coupon:</strong>
              <p className="font-medium mt-1">{transaction?.coupon || "N/A"}</p>
            </div>
            <div>
              <strong>Promotion:</strong>
              <p className="font-medium mt-1">
                {transaction?.promotion || "N/A"}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Event Information */}
        <Card>
          <CardHeader>
            <CardTitle>Event Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
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
          <CardHeader>
            <CardTitle>Payment Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
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
                Rp {transaction?.totalPrice?.toLocaleString() ?? "0"}
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

        <Card>
          <CardHeader>
            <CardTitle>Payment Proof</CardTitle>
          </CardHeader>
          <CardContent>
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
        <div className="flex justify-end gap-4 mt-6">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="destructive">Reject Transaction</Button>
            </DialogTrigger>
            <DialogContent>
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
    </Card>
  );
};

export default TransactionsIdOrganizerPage;
