// Server.ts
// The Starting point of the API: connect to MongoDB, then start listening for requests.
import app from "./app";
import { connectDB } from "./config/database";
import { env } from "./config/env";

// Step 6: Start the server
// the starting points: connect to MongoDB first, then start listening on the port . if the database cant be reached, show the error and stop

const startServer = async () => {
  try {
    await connectDB(); //uses MONGO_URL from the .env file

    app.listen(env.port, () => {
      console.log(`QuickTask Api running on http://localhost:${env.port}`);
    });
  } catch (error) {
    console.error("could not connect to MongoDB ", (error as Error).message);
    process.exit(1);
  }
};

startServer();

// Next: Step 7 (The Category model) -> Server/src/model/Category.ts
