import { ConvexHttpClient } from "convex/browser";

let convexClient = null;

if (!convexClient) {
  convexClient = new ConvexHttpClient(process.env.CONVEX_URL as string);
}

export default convexClient;
