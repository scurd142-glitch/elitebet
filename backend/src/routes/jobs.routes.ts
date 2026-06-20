import { Router } from "express";
import { asyncHandler } from "../utils/async-handler";
import { authMiddleware } from "../middleware/auth.middleware";
import { adminMiddleware } from "../middleware/admin.middleware";
import { requireActivated } from "../middleware/activated.middleware";
import * as jobsController from "../controllers/jobs.controller";

export const jobsRouter = Router();

jobsRouter.get("/categories", asyncHandler(jobsController.listCategories));

jobsRouter.use(authMiddleware, requireActivated);

jobsRouter.get("/", asyncHandler(jobsController.listOpenJobs));
jobsRouter.get("/mine", asyncHandler(jobsController.listMyJobs));

const adminJobs = Router();
adminJobs.use(adminMiddleware);
adminJobs.post("/:id/complete", asyncHandler(jobsController.completeJob));
jobsRouter.use("/manage", adminJobs);

jobsRouter.get("/:id", asyncHandler(jobsController.getJob));
jobsRouter.post("/:id/accept", asyncHandler(jobsController.acceptJob));
jobsRouter.post("/:id/submit", asyncHandler(jobsController.submitJob));
