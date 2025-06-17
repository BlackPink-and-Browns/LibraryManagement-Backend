import { Repository } from "typeorm";
import { Genre } from "../entities/genre.entity";

class GenreRepository {
  constructor(private repository: Repository<Genre>) {}

  async create(genre: Genre): Promise<Genre> {
    return this.repository.save(genre);
  }

  async findOneByID(id: number): Promise<any> {
    const genre = await this.repository.findOne({
      where: { id },
      select: {
        id:true,
        name:true,
        description:true,
        books:{
            id:true,
            isbn:true,
            title:true,
            cover_image:true,
            description:true
        }
      },
      relations: {
        books: true,
      },
    });

    if (!genre) return null;

    return genre;
  }

  async findAll(): Promise<any[]> {
    const genres = await this.repository.find({
      select: {
        id:true,
        name:true,
        description:true,
        books:{
            id:true,
            isbn:true,
            title:true,
            cover_image:true,
            description:true
        }
      },
      relations: {
        books: true,
      },
    });

    return genres;
  }

  async remove(genre: Genre): Promise<void> {
    if (!genre.id) {
      throw new Error("Genre entity must have an id to be removed.");
    }
    await this.repository.remove(genre);
  }
}

export default GenreRepository;
