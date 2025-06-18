import { Request, Response, Router, NextFunction } from "express";
import { EmployeeRole } from "../entities/enums";
import httpException from "../exceptions/http.exception";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import {checkRole } from "../middlewares/authorization.middleware";
import AnalyticsService from "../services/analytics.service";

class AnalyticsController {
    constructor(private authorService: AnalyticsService, router: Router) {
        router.post("/", checkRole([EmployeeRole.ADMIN]), this.createAuthor.bind(this));
    }

}

export default AnalyticsController;