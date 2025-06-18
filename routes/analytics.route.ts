import express from "express";
import AnalyticsService from "../services/analytics.service";
import AnalyticsController from "../controllers/analytics.controller";
import { bookRepository } from "./book.route";
import { employeeRepository } from "./employee.route";
import { shelfRepository } from "./shelf.route";
import { bookCopyRepository } from "./book-copy.route";
import { auditLogRepository } from "./audit.route";
import { borrowRepository } from "./borrow.route";

const analyticsRouter = express.Router();

const analyticsService = new AnalyticsService(
  bookRepository,
  employeeRepository,
  shelfRepository,
  bookCopyRepository,
  auditLogRepository,
  borrowRepository
);
const analyticsController = new AnalyticsController(
  analyticsService,
  analyticsRouter
);

export { analyticsService };
export default analyticsRouter;
