import { Router } from "express";
import { protectedController } from "../controllers/protected.controller.js";
import { rootController } from "../controllers/root.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { analyticsRouter } from "./analytics.routes.js";
import { assistantRouter } from "./assistant.routes.js";
import { authRouter } from "./auth.routes.js";
import { clientRouter } from "./client.routes.js";
import { invoiceRouter } from "./invoice.routes.js";

export const apiRouter = Router();

apiRouter.get("/", rootController);
apiRouter.use("/auth", authRouter);
apiRouter.use("/clients", clientRouter);
apiRouter.use("/invoices", invoiceRouter);
apiRouter.use("/analytics", analyticsRouter);
apiRouter.use("/assistant", assistantRouter);
apiRouter.get("/protected", requireAuth, protectedController);
