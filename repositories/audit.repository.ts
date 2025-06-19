import { Repository } from "typeorm";
import { AuditLog } from "../entities/auditlog.entity";
import { error } from "winston";
import httpException from "../exceptions/http.exception";
import { EntityType } from "../entities/enums";

class AuditLogRepository {
  constructor(private repository: Repository<AuditLog>) {}

  async create(auditlog: AuditLog): Promise<AuditLog> {
    return this.repository.save(auditlog);
  }

  async findAll(
    user_id?: number,
    entity_id?: string,
    take?: number,
    order: "ASC" | "DESC" = "DESC"
  ): Promise<AuditLog[]> {
    return this.repository.find({
      where: {
        ...(user_id && { employee: { id: Number(user_id) } }),
        ...(entity_id && { entityId: entity_id.toString() }),
      },
      take,
      order: {
        createdAt: order,
      },
      select: {
        id: true,
        action: true,
        entityType: true,
        entityId: true,
        employee: {
          id: true,
          employeeID: true,
        },
        createdAt: true,
      },
      relations: {
        employee: true,
      },
    });
  }

  async countActiveUsers({previousCount = false}: {previousCount?: boolean}) {
    const now = new Date();
    const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    const countUniqueEmployeesCurrentMonth = await this.repository
            .createQueryBuilder('audit_log')
            .select('COUNT(DISTINCT audit.employeeId)', 'count')
            .where('audit.action = :action', { action: 'CREATE' })
            .andWhere('audit.entityType IN (:...entities)', {
              entities: [EntityType.BORROW_RECORD, EntityType.WAITLIST],
            })
            .getRawOne();
  }
}

export default AuditLogRepository;
