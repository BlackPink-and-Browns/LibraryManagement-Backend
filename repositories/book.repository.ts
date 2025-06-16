import { Repository } from "typeorm";
import { Book } from "../entities/book.entity";

class BookRepository {
    constructor(private repository: Repository<Book>) {}

    async create(book: Book): Promise<Book> {
        return this.repository.save(book);
    }

    async update (id:number , book: Book): Promise<void> {
        await this.repository.save({id,...book})
    }

    async delete (id:number): Promise<void> {
        await this.repository.delete({id})
    }

    async findMany(): Promise<Book[]> {
        return this.repository.find({
            select: {
                id: true,
                isbn: true,
                title: true,
                description: true,
                cover_image: true,
                authors: {
                    id: true,
                    name: true,
                },
                genres: {
                    id: true,
                    name: true,
                },
                copies: {
                    id: true,
                    shelf: true,
                },
                reviews: {
                    id: true,
                    rating: true,
                    content: true,
                },
            },
            relations: {
                authors: true,
                genres: true,
                copies: true,
                reviews: true,
            },
        });
    }
    async findOneByID(id:number): Promise<Book> {
        return this.repository.findOne({
            where: {id},
            select: {
                id: true,
                isbn: true,
                title: true,
                description: true,
                cover_image: true,
                authors: {
                    id: true,
                    name: true,
                },
                genres: {
                    id: true,
                    name: true,
                },
                copies: {
                    id: true,
                    shelf: true,
                },
                reviews: {
                    id: true,
                    rating: true,
                    content: true,
                },
            },
            relations: {
                authors: true,
                genres: true,
                copies: true,
                reviews: true,
            },
        });
    }
}

export default BookRepository;
