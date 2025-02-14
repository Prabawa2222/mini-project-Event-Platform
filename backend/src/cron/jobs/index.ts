import { JobsRegistry } from "../../types";
import { transactionStatusJobs } from "./transactionJobs";
import { userStatusJobs } from "./userJobs";

export const jobs: JobsRegistry = {
  ...transactionStatusJobs,
  ...userStatusJobs,
};

export type JobName = keyof typeof jobs;
