//app.ts
//Creates the express app: Settings first, then all the /api routes, then the "not found" and error handlers.

// it does not start listening; server.ts does that

import express from "express";
import { env } from "./config/env";
import cors from "cors";
import { notfound } from "./middleware/notFound";
import router from "./routes";

// Step 3 Create the express app
//The Express app: Allow the Website to call us (Cors), read Json bodies, server uploaded photos, put every route under /api, then the 404 and errors handlers

// The Express app: allow the website to call the server
const app = express();
app.use(cors({ origin: env.clientUrl, credentials: true })); // let the website (client_URL) call gthe api
app.use(express.json());

app.use("/api", router); // every route lives under /api, e.g /api/health

app.use(notfound); // must come after the routes: runs only when nothing aboves matches

export default app;

// Next: STEP 4 (Handle unknown Urls and errors) -> server/src/middleware/notfound.ts
