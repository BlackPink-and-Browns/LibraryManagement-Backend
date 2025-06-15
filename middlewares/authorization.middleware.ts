import { EmployeeRole } from "../types/enums";
import httpException from "../exceptions/http.exception";
import { NextFunction, Request, Response } from "express";

export const checkRole = (authorizedRoles:EmployeeRole[]) => {
    return (req : Request, res: Response, next: NextFunction) => {
        const userRole = req.user?.role
        let hasAccess = authorizedRoles.includes(userRole)
        if(!hasAccess) {
            throw new httpException(403,"User has no permission")
        }
        next()
    };
}
