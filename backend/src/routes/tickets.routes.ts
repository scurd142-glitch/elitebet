import { Router } from "express";
import { asyncHandler } from "../utils/async-handler";
import { authMiddleware } from "../middleware/auth.middleware";
import { adminMiddleware } from "../middleware/admin.middleware";
import * as ticketsController from "../controllers/tickets.controller";

export const ticketsRouter = Router();

ticketsRouter.use(authMiddleware);

ticketsRouter.get("/", asyncHandler(ticketsController.listMyTickets));
ticketsRouter.post("/", asyncHandler(ticketsController.createTicket));
ticketsRouter.get("/:id", asyncHandler(ticketsController.getMyTicket));
ticketsRouter.post("/:id/reply", asyncHandler(ticketsController.replyToTicket));

const adminTickets = Router();
adminTickets.use(adminMiddleware);
adminTickets.get("/", asyncHandler(ticketsController.listAllTickets));
adminTickets.get("/:id", asyncHandler(ticketsController.getAdminTicket));
adminTickets.post("/:id/reply", asyncHandler(ticketsController.replyToTicket));
adminTickets.patch("/:id/status", asyncHandler(ticketsController.updateTicketStatus));

ticketsRouter.use("/admin", adminTickets);
