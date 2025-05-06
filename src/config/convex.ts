import { ConvexHttpClient } from "convex/browser";
import dotenv from "dotenv";

dotenv.config();

let convexClient: ConvexHttpClient | null = null;

if (!convexClient) {
  convexClient = new ConvexHttpClient(process.env.CONVEX_URL as string);
}

export default convexClient;
