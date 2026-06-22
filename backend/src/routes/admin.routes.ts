import { Router } from "express";
import { asyncHandler } from "../utils/async-handler";
import { authMiddleware } from "../middleware/auth.middleware";
import { adminMiddleware } from "../middleware/admin.middleware";
import * as adminController from "../controllers/admin.controller";

export const adminRouter = Router();

adminRouter.get("/content/public", asyncHandler(adminController.getPublicContent));

adminRouter.use(authMiddleware, adminMiddleware);

adminRouter.get("/analytics", asyncHandler(adminController.getAnalytics));
adminRouter.get("/users", asyncHandler(adminController.listUsers));
adminRouter.patch("/users/:id/ban", asyncHandler(adminController.toggleBanUser));

adminRouter.get("/announcements", asyncHandler(adminController.listAnnouncements));
adminRouter.post("/announcements", asyncHandler(adminController.createAnnouncement));
adminRouter.patch("/announcements/:id", asyncHandler(adminController.updateAnnouncement));
adminRouter.delete("/announcements/:id", asyncHandler(adminController.deleteAnnouncement));

adminRouter.get("/content", asyncHandler(adminController.getSiteContent));
adminRouter.put("/content", asyncHandler(adminController.upsertSiteContent));

adminRouter.get("/categories", asyncHandler(adminController.listCategories));
adminRouter.post("/categories", asyncHandler(adminController.createCategory));
adminRouter.post("/categories/seed", asyncHandler(adminController.seedCategories));
