import { error } from "console";
import winston from "winston";
import "winston-daily-rotate-file";

const logFormat = winston.format.printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level.toUpperCase()}]: ${message}`;
});

const transportAll = new winston.transports.DailyRotateFile({
  filename: "logs/app-%DATE%.log",
  datePattern: "DD-MM-YYYY",
  zippedArchive: true,
  maxSize: "20m",
  maxFiles: "10d",
});

const transportError = new winston.transports.DailyRotateFile({
  filename: "logs/app-%DATE%.log",
  level: "error",
  datePattern: "DD-MM-YYYY",
  zippedArchive: true,
  maxSize: "20m",
  maxFiles: "10d",
});

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(winston.format.timestamp(), logFormat),
  transports: [transportAll, transportError],
});

if (process.env.NODE_ENV !== "production") {
  logger.add(new winston.transports.Console());
}

export default logger;
