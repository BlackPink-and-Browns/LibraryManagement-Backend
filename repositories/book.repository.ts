import { IntegerType, Repository } from "typeorm";
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
                avg_rating:true,
                is_available:true,
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
                    is_available: true
                },
                reviews: {
                    id: true,
                    rating: true,
                    content: true,
                    employee: {
                        id:true,
                        name: true
                    }
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
                avg_rating:true,
                is_available:true,
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
                    is_available:true
                },
                reviews: {
                    id: true,
                    rating: true,
                    content: true,
                    employee: {
                        id:true,
                        name: true
                    }
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

    async findOnebyISBN(isbn:string): Promise<Book>{
        return this.repository.findOne({
            where: {isbn:isbn},
            select: {
                id: true,
                isbn: true,
                title: true,
                description: true,
                cover_image: true,
                avg_rating:true,
                is_available:true,
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
                    is_available:true
                },
                reviews: {
                    id: true,
                    rating: true,
                    content: true,
                    employee: {
                        id:true,
                        name: true
                    }
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

    async findPreviewByID(id:number): Promise<Book> {
        return this.repository.findOne({
            where: {id},
            select: {
                id: true,
                title: true,
            }
        })
    }

    async totalCount(): Promise<IntegerType> {
        return this.repository.count()
    }

    async findRecentlyCreated(take: number) {
        return this.repository.find({
            take,
            order: { createdAt: 'DESC' },
            relations: {
                authors: true
            },
            select: {
            id: true,
            isbn: true,
            title: true,
            description: true,
            cover_image: true,
            createdAt: true,
            authors: {
                id: true,
                name: true,
            },
            genres: {
                id: true,
                name: true,
            },
            },
        });  
    }
}

export default BookRepository;
