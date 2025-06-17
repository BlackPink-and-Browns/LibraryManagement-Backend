import { Genre } from "../entities/genre.entity";
import { CreateGenreDTO } from "../dto/genres/create-genre.dto";
import GenreRepository from "../repositories/genre.repository";
import BookRepository from "../repositories/book.repository";
import httpException from "../exceptions/http.exception";
import { LoggerService } from "./logger.service";
import { auditLogService } from "../routes/audit.route";

class GenreService {
  private logger = LoggerService.getInstance(GenreService.name);

  constructor(
    private genreRepository: GenreRepository,
  ) {}

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

  async createGenre(createDto: CreateGenreDTO, userId?: number): Promise<Genre> {
    const genre = new Genre();
    genre.name = createDto.name;
    genre.description = createDto.description;

    const created = await this.genreRepository.create(genre);

    auditLogService.createAuditLog(
      "CREATE",
      userId,
      created.id.toString(),
      "GENRE"
    );

    this.logger.info(`Created genre with ID ${created.id}`);
    return created;
  }

  async deleteGenre(id: number, userId?: number): Promise<void> {
  const genre = await this.genreRepository.findOneByID(id);
  if (!genre) {
    this.logger.error(`Genre with id ${id} not found`);
    throw new httpException(404, "Genre not found");
  }

  await this.genreRepository.remove(genre);

  auditLogService.createAuditLog("DELETE", userId, id.toString(), "GENRE");
  this.logger.info(`Deleted genre with ID ${id}`);
}

}

export default GenreService;
