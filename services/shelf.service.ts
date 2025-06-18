import { Shelf } from "../entities/shelf.entity";
import ShelfRepository from "../repositories/shelf.repository";
import OfficeRepository from "../repositories/office.repository";
import { CreateShelfDto } from "../dto/shelf/create-shelf.dto";
import { UpdateShelfDto } from "../dto/shelf/update-shelf.dto";
import httpException from "../exceptions/http.exception";
import { LoggerService } from "./logger.service";
import { auditLogService } from "../routes/audit.route";
import datasource from "../db/data-source";
import { AuditLogType, EntityType } from "../entities/enums";

class ShelfService {
    private entityManager = datasource.manager;
    private logger = LoggerService.getInstance(ShelfService.name);

    constructor(
        private shelfRepository: ShelfRepository,
        private officeRepository: OfficeRepository
    ) {}

    async getAll(): Promise<Shelf[]> {
        this.logger.info("Fetched all shelves");
        return this.shelfRepository.findAll();
    }

    async getOneByID(id: number): Promise<Shelf | null> {
        const shelf = await this.shelfRepository.findOneByID(id);
        if (!shelf) {
            this.logger.error(`Shelf with id ${id} not found`);
            throw new httpException(404, "Shelf not found");
        }
        this.logger.info(`Fetched shelf with id ${id}`);
        return shelf;
    }

    async create(createDto: CreateShelfDto, userId?: number): Promise<Shelf> {
        const office = await this.officeRepository.findOneByID(
            createDto.officeId
        );

        if (!office) {
            this.logger.error(`Office with id ${createDto.officeId} not found`);
            throw new httpException(404, "Office not found");
        }

        const label_no = createDto.label_id;

        // Format the label number to 3-digit string (e.g., "001")
        const formattedLabelNo = label_no.toString().padStart(3, "0");

        // Create the label
        const label = `${office.name}-${formattedLabelNo}`;

        // Prepare the Shelf entity
        const shelf = new Shelf();
        shelf.label = label;
        shelf.office = office;
        return await this.entityManager.transaction(async (manager) => {
            const m = manager.getRepository(Shelf);
            const createdShelf = await m.save(shelf);

            const error = await auditLogService.createAuditLog(
                AuditLogType.CREATE,
                userId,
                createdShelf.id.toString(),
                EntityType.SHELF,
                manager
            );
            if (error.error) {
                throw error.error;
            }
            this.logger.info(`Shelf created with label ${label}`);
            return createdShelf;
        });
    }

    async update(
        id: number,
        updateDto: UpdateShelfDto,
        userId?: number
    ): Promise<void> {
        const shelf = await this.shelfRepository.findOneByID(id);
        if (!shelf) {
            this.logger.error(`Shelf with id ${id} not found for update`);
            throw new httpException(404, "Shelf not found");
        }

        // If only label_id is updated but office remains the same
        if (updateDto.label_id !== undefined && shelf.office) {
            const formattedLabelNo = updateDto.label_id
                .toString()
                .padStart(3, "0");
            shelf.label = `${shelf.office.name}-${formattedLabelNo}`;
        } else {
            this.logger.error(`label id is not provided`);
            throw new httpException(400, "label id is not provided");
        }

        await this.entityManager.transaction(async (manager) => {
            const m = manager.getRepository(Shelf);
            await m.save({ id, ...shelf });

            const error = await auditLogService.createAuditLog(
                AuditLogType.UPDATE,
                userId,
                shelf.id.toString(),
                EntityType.SHELF,
                manager
            );
            if (error.error) {
                throw error.error;
            }
            this.logger.info(`Shelf updated with id ${id}`);
        });
    }

    async delete(id: number, userId?: number): Promise<void> {
        const shelf = await this.shelfRepository.findOneByID(id);
        if (!shelf) {
            this.logger.error(`Shelf with id ${id} not found for deletion`);
            throw new httpException(404, "Shelf not found");
        }

        return await this.entityManager.transaction(async (manager) => {
            const m = manager.getRepository(Shelf);
            const shelf_id = shelf.id.toString();
            await m.remove(shelf);

            const error = await auditLogService.createAuditLog(
                AuditLogType.DELETE,
                userId,
                shelf_id,
                EntityType.SHELF,
                manager
            );
            if (error.error) {
                throw error.error;
            }
            this.logger.info(`Shelf deleted with id ${id}`);
        });
    }

    async getShelfCount(): Promise<number> {
        return this.shelfRepository.countAll();
    }
}

export default ShelfService;
