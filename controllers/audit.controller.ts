import AuditLogService from "../services/audit.service";
import { Router, Request, Response, NextFunction } from "express";

class AuditLogController {
    constructor(private auditlogservice: AuditLogService, router: Router) {
        router.get("/",this.getAllAuditLogs.bind(this))
    }

    async getAllAuditLogs(req:Request,res:Response,next:NextFunction) {
        try {
            const {user_id,entity_id} = req.query
            const auditLogs = await this.auditlogservice.getAllAuditLogs( user_id, entity_id)
            res.status(200).json(auditLogs)
        }
        catch (error){
            console.log(error)
            next(error)
        }
    }
}
export default AuditLogController;
