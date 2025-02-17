import { initializeEmailTransporter } from "../config/mail.config";

export class EmailService {
  private emailTransporter: any;

  constructor() {
    this.initializeTransporter();
  }

  private async initializeTransporter() {
    this.emailTransporter = await initializeEmailTransporter();
  }

  async sendTransactionApprovalEmail(
    userEmail: string,
    transactionDetails: {
      eventName: string;
      ticketType: string;
      quantity: number;
      totalPrice: number;
    }
  ): Promise<void> {
    try {
      await this.emailTransporter.sendMail({
        from: `"${process.env.APP_NAME}" <${process.env.EMAIL_FROM}>`,
        to: userEmail,
        subject: "Transaction Approved",
        html: `
          <h1>Transaction Approved</h1>
          <p>Your transaction for the following event has been approved:</p>
          <ul>
            <li>Event: ${transactionDetails.eventName}</li>
            <li>Ticket Type: ${transactionDetails.ticketType}</li>
            <li>Quantity: ${transactionDetails.quantity}</li>
            <li>Total Price: ${transactionDetails.totalPrice}</li>
          </ul>
          <p>Thank you for your purchase!</p>
        `,
      });
    } catch (error) {
      console.error("Failed to send approval email:", error);
      throw new Error("Failed to send approval notification email");
    }
  }

  async sendTransactionRejectionEmail(
    userEmail: string,
    transactionDetails: {
      eventName: string;
      ticketType: string;
      quantity: number;
      totalPrice: number;
    },
    rejectionReason: string
  ): Promise<void> {
    try {
      await this.emailTransporter.sendMail({
        from: `"${process.env.APP_NAME}" <${process.env.EMAIL_FROM}>`,
        to: userEmail,
        subject: "Transaction Rejected",
        html: `
          <h1>Transaction Rejected</h1>
          <p>Your transaction for the following event has been rejected:</p>
          <ul>
            <li>Event: ${transactionDetails.eventName}</li>
            <li>Ticket Type: ${transactionDetails.ticketType}</li>
            <li>Quantity: ${transactionDetails.quantity}</li>
            <li>Total Price: ${transactionDetails.totalPrice}</li>
          </ul>
          <p><strong>Reason for rejection:</strong> ${rejectionReason}</p>
          <p>Any points, vouchers, or coupons used in this transaction have been returned to your account.</p>
        `,
      });
    } catch (error) {
      console.error("Failed to send rejection email:", error);
      throw new Error("Failed to send rejection notification email");
    }
  }
}
