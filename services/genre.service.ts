import { Genre } from "../entities/genre.entity";
import { CreateGenreDTO } from "../dto/genres/create-genre.dto";
import GenreRepository from "../repositories/genre.repository";
import BookRepository from "../repositories/book.repository";
import httpException from "../exceptions/http.exception";
import { LoggerService } from "./logger.service";
import { auditLogService } from "../routes/audit.route";
import datasource from "../db/data-source";
import { AuditLogType, EntityType } from "../entities/enums";

class GenreService {
    private entityManager = datasource.manager;
    private logger = LoggerService.getInstance(GenreService.name);

    constructor(private genreRepository: GenreRepository) {}

    async getAllGenres(): Promise<Genre[]> {
        this.logger.info("Fetched all genres");
        return this.genreRepository.findAll();
    }

    async getGenreById(id: number): Promise<Genre> {
        const genre = await this.genreRepository.findOneByID(id);
        if (!genre) {
            this.logger.error(`Genre with id ${id} not found`);
            throw new httpException(404, "Genre not found");
        }
        this.logger.info(`Fetched genre with ID ${id}`);
        return genre;
    }

    async createGenre(
        createDto: CreateGenreDTO,
        userId?: number
    ): Promise<Genre> {
        const genre = new Genre();
        genre.name = createDto.name;
        genre.description = createDto.description;

        return await this.entityManager.transaction(async (manager) => {
            const m = manager.getRepository(Genre);
            const created = await m.save(genre);

            const error = await auditLogService.createAuditLog(
                AuditLogType.CREATE,
                userId,
                created.id.toString(),
                EntityType.GENRE,
                manager
            );
			if (error.error) {
                throw error.error;
            }
            this.logger.info(`Created genre with ID ${created.id}`);
            return created;
        });
    }

    async deleteGenre(id: number, userId?: number): Promise<void> {
        const genre = await this.genreRepository.findOneByID(id);
        if (!genre) {
            this.logger.error(`Genre with id ${id} not found`);
            throw new httpException(404, "Genre not found");
        }
        return await this.entityManager.transaction(async (manager) => {
			const m = manager.getRepository(Genre)
            await this.genreRepository.remove(genre);

            const error = await auditLogService.createAuditLog(
                AuditLogType.DELETE,
                userId,
                id.toString(),
                EntityType.GENRE,
				manager
            );
			if (error.error) {
                throw error.error;
            }
            this.logger.info(`Deleted genre with ID ${id}`);
        });
    }

    async getTrendingGenres() {
      return this.genreRepository.findPopular(8, true)
    }
}

export default GenreService;
