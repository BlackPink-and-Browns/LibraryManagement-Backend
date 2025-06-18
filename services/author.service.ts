import { LoggerService } from "./logger.service";
import { Author } from "../entities/author.entity";
import { UpdateAuthorDTO } from "../dto/authors/update-author.dto";
import AuthorRepository from "../repositories/author.repository";
import httpException from "../exceptions/http.exception";
import { auditLogService } from "../routes/audit.route";
import datasource from "../db/data-source";
import { AuditLog } from "../entities/auditlog.entity";
import { AuditLogType, EntityType } from "../entities/enums";
import AuditLogService from "./audit.service";

class AuthorService {
    private enityManager = datasource.manager;
    private logger = LoggerService.getInstance(AuthorService.name);

    constructor(
        private authorRepository: AuthorRepository,
    ) {}

    async createAuthor(CreateAuthorDTO, user_id: number): Promise<Author> {
        return await this.enityManager.transaction(async (manager) => {
            const m = manager.getRepository(Author);
            const newAuthor = new Author();
            newAuthor.name = CreateAuthorDTO.name;
            const createdAuthor = await m.save(newAuthor);

            const error = await auditLogService.createAuditLog(
                AuditLogType.CREATE,
                user_id,
                createdAuthor.id.toString(),
                EntityType.AUTHOR,
                manager
            );
            if (error.error) {
                throw error.error;
            }
            this.logger.info("author created");
            return createdAuthor;
        });
    }

    async getAllAuthors(): Promise<Author[]> {
        this.logger.info("book array returned");
        return this.authorRepository.findAll();
    }

    async getAuthorByID(id: number): Promise<Author> {
        const author = await this.authorRepository.findDetailedByID(id);
        if (!author) {
            this.logger.error("author not found");
            throw new httpException(400, "Author not found");
        }
        this.logger.info("author returned");
        return author;
    }

    async updateAuthor(
        id: number,
        UpdateAuthorDTO,
        user_id: number
    ): Promise<void> {
        const existingAuthor = await this.authorRepository.findOneByID(id);
        if (!existingAuthor) {
            this.logger.error("author not found");
            throw new httpException(400, "Author not found");
        }

        existingAuthor.name = UpdateAuthorDTO.name;

        return await this.enityManager.transaction(async (manager) => {
            await manager.save({ id, ...existingAuthor });

            const error = await auditLogService.createAuditLog(
                AuditLogType.UPDATE,
                user_id,
                existingAuthor.id.toString(),
                EntityType.AUTHOR,
                manager
            );
            if (error.error) {
                throw error.error;
            }
            this.logger.info("author updated");
        });
    }
}

export default AuthorService;
