import { Request, Response, Router, NextFunction } from "express";
import { EmployeeRole } from "../entities/enums";
import httpException from "../exceptions/http.exception";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import {checkRole } from "../middlewares/authorization.middleware";
import AnalyticsService from "../services/analytics.service";

class AnalyticsController {
    constructor(private analyticsService: AnalyticsService, router: Router) {
        router.get("/", checkRole([EmployeeRole.ADMIN]), this.getDashboardSummary.bind(this));
    }

    async getDashboardSummary(req: Request, res: Response, next: NextFunction) {
        try {
            const summary = await this.analyticsService.getDashboardSummary();
            res.status(200).send(summary);
        } catch (err) {
            console.log(err);
            next(err);
        }
    }

}

export default AnalyticsController;