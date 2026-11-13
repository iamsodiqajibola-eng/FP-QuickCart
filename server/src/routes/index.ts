// routes/index.ts
// Join all route files together. app.ts puts these under /api.

import { Router } from "express";
import categoryRoutes from "./categoryRoutes";
import productRoutes from "./productRoutes";
import authRoutes from "./authRoutes";

// Step 5: Join the routes and add a health check.
// One router joins all the route files.
// app.ts mounts it at /api.

const router = Router();

// GET /api/health: Check that the API is running.

router.get("/health", (_req, res) =>
  res.json({
    status: "ok",
    message: "QuickCart API is running",
  }),
);

// Step 15: Category API routes.
// GET /api/categories
// GET /api/categories/:slug

router.use("/categories", categoryRoutes);
router.use("/products", productRoutes);
router.use("/auth", authRoutes);

export default router;

// Next step: Start the server => server/src/server.ts
