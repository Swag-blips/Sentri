import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import logRequests from "./middleware/logRequests";
import errorHandler from "./utils/errorHandler";
import logger from "./utils/logger";
import tenantRoutes from "./routes/tenants.routes";

dotenv.config();

const port = process.env.PORT || 5000;
const app = express();

app.use(express.json());

app.use(helmet());
app.use(logRequests);
app.use(errorHandler);

app.use("/api/tenants", tenantRoutes);

app.listen(port, () => {
  logger.info(`Server is running on port ${port}`);
});

process.on("uncaughtException", (err) => {
  logger.error(`uncaught exception ${err.message}`);
  process.exit(1);
});

process.on("unhandledRejection", (err) => {
  logger.error(`unhandled rejection  ${err}`);

  process.exit(1);
});
