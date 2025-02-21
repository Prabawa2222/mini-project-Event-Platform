import cron from "node-cron";
import { jobs } from "./jobs";

export const initializeCronJobs = () => {
  Object.entries(jobs).forEach(([jobName, job]) => {
    console.log(
      `Setting up cron job: ${jobName} with schedule: ${job.schedule}`
    );

    cron.schedule(job.schedule, async () => {
      console.log(
        `Running cron job: ${jobName} at ${new Date().toISOString()}`
      );
      try {
        await job.handler();
        console.log(
          `Completed cron job: ${jobName} at ${new Date().toISOString()}`
        );
      } catch (error) {
        console.error(`Error in cron job ${jobName}:`, error);
      }
    });
  });

  console.log("All cron jobs initialized");
};
