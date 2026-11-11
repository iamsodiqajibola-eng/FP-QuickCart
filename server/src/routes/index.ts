// routes/index.ts
//Join all the files together app.ts puts theses under /api

import { Router } from "express";

//Step 5: join the route and add a health check
// One router joins all the route files. app,ts mounts it at api, so a route like e-g "/products" becomes /api/products

const router = Router();

//Get /api/health: a quick check that the API is running

router.get("health", (_req, res) =>
  res.json({ status: "ok", message: "QuickCart API is running" }),
);

export default router;

// NEXT STEP 6: Start the server => server/src/server.ts

//we are asked to channge that "health" to "/health"
