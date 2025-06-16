import { LoggerService } from "./logger.service";
import { Author } from "../entities/author.entity";
import { UpdateAuthorDTO } from "../dto/authors/update-author.dto";
import AuthorRepository from "../repositories/author.repository";
import httpException from "../exceptions/http.exception";
import { auditLogService } from "../routes/audit.route";

class AuthorService {
  private logger = LoggerService.getInstance(AuthorService.name);

  constructor(private authorRepository: AuthorRepository) {}

  async createAuthor(CreateAuthorDTO, user_id: number): Promise<Author> {
    const newAuthor = new Author();
    newAuthor.name = CreateAuthorDTO.name;
    const createdAuthor = this.authorRepository.create(newAuthor);

    auditLogService.createAuditLog(
        "CREATE",
        user_id,
        (await createdAuthor).id.toString(),
        "AUTHOR"
    );

    this.logger.info("author created");
    return createdAuthor
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
        user_id: number,
    ): Promise<void> {
        const existingAuthor = await this.authorRepository.findOneByID(id);
        if (!existingAuthor) {
            this.logger.error("author not found");
            throw new httpException(400, "Author not found");
        }

        existingAuthor.name = UpdateAuthorDTO.name;
        await this.authorRepository.update(id, existingAuthor);

        auditLogService.createAuditLog(
            "UPDATE",
            user_id,
            (await existingAuthor).id.toString(),
            "AUTHOR"
        );

        this.logger.info("author updated")
    }

}

export default AuthorService;