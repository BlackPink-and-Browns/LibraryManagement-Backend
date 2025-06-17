import express from 'express'
import AuditLogRepository from '../repositories/audit.repository'
import datasource from '../db/data-source'
import { AuditLog } from '../entities/auditlog.entity'
import AuditLogService from '../services/audit.service'
import AuditLogController from '../controllers/audit.controller'

const auditLogRouter = express.Router()

const auditLogRepository = new AuditLogRepository(datasource.getRepository(AuditLog))
const auditLogService = new AuditLogService(auditLogRepository)
const auditLogController = new AuditLogController(auditLogService,auditLogRouter)

export {auditLogService,auditLogRepository}
export default auditLogRouter