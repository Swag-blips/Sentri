import express from "express";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";
import helmet from "helmet";
import logRequests from "./middleware/logRequests";
import errorHandler from "./utils/errorHandler";
import logger from "./utils/logger";

dotenv.config();

const port = process.env.PORT || 3000;
const app = express();

const supabase = createClient(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_API_KEY as string
);
app.use(helmet());
app.use(logRequests);
app.use(errorHandler);

app.listen(port, () => {
  logger.info(`server is running on port ${port}`);
});

process.on("uncaughtException", (err) => {
  logger.error(`uncaught exception ${err.message}`);
  process.exit(1);
});

process.on("unhandledRejection", (err) => {
  logger.error(`unhandled rejection  ${err}`);

  process.exit(1);
});
