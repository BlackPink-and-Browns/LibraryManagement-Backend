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

  async countActiveUsers({ previousCount = false }: { previousCount?: boolean }) {
    const now = new Date();
    const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfPreviousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfPreviousMonth = new Date(startOfCurrentMonth);

    const baseQuery = this.repository
      .createQueryBuilder('audit')
      .select('COUNT(DISTINCT audit.employeeId)', 'count')
      .where('audit.action = :action', { action: 'CREATE' })
      .andWhere('audit.entityType IN (:...entities)', {
        entities: [EntityType.BORROW_RECORD, EntityType.WAITLIST],
      });
    const result: {
      currentMonthCount?: number;
      previousMonthCount?: number;
    } = {};
    const currentMonthQuery = baseQuery
      .clone()
      .andWhere('audit.createdAt >= :startOfCurrentMonth', {
        startOfCurrentMonth,
      });

    const current = await currentMonthQuery.getRawOne();
    result.currentMonthCount = parseInt(current.count, 10);

    if (previousCount) {
      const previousMonthQuery = baseQuery
        .clone()
        .andWhere('audit.createdAt >= :startOfPreviousMonth', {
          startOfPreviousMonth,
        })
        .andWhere('audit.createdAt < :endOfPreviousMonth', {
          endOfPreviousMonth,
        });
      const previous = await previousMonthQuery.getRawOne();
      result.previousMonthCount = parseInt(previous.count, 10);
    }
    return result;
  }
}

export default AuditLogRepository;
