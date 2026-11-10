//database.ts
//Connects to MongoDB using the MONGO_URL from the .env file

// Step 2: Connect to MongoDB
// connectDB() opens the connection to MongoDb with the address from .env .server.ts, calls it before the API Starts

// Next: Step 3 (Create the Express app) -> server/src/app.ts

import dns from "node:dns";
import mongoose from "mongoose";
import { env } from "./env";

export const connectDB = async () => {
  try {
    // Use Cloudflare and Google DNS for MongoDB SRV lookup
    dns.setServers(["1.1.1.1", "8.8.8.8"]);

    const connection = await mongoose.connect(env.mongoUri);

    console.log(`MongoDB Connected: ${connection.connection.host}`);
  } catch (error) {
    console.error("Could not connect to MongoDB:", error);
    throw error;
  }
};
