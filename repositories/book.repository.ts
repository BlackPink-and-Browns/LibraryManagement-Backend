import { Between, IntegerType, LessThan, Repository } from "typeorm";
import { Book } from "../entities/book.entity";
import { BorrowStatus, WaitlistStatus } from "../entities/enums";

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
                    shelf: {
                        label: true,
                        office: true,
                    },
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
                    shelf:true,
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
                copies: {
                    shelf:{
                        office:true
                    }
                },
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
                    shelf: {
                        label: true,
                        office: true,
                    },
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
                is_available: true,
            }
        })
    }

    async findPreviewByIsbn(isbn: string) {
         return this.repository.findOne({
            where: {isbn},
            select: {
                id: true,
            }
        })
    }

    async totalCount({previousCount = false}: {previousCount?: boolean}): Promise<{ totalCount: number; previousMonthCount?: number; }> {
        const totalCount = await this.repository.count();
        if (previousCount) {
            const now = new Date();
            const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);

            const previousMonthCount = await this.repository.count({
                where: {
                createdAt: LessThan(startOfCurrentMonth),
                },
            });
            return {
                totalCount,
                previousMonthCount,
            };
        }
        return {totalCount}
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
            title: true,
            is_available: true,
            avg_rating: true,
            createdAt: true,
            authors: {
                id: true,
                name: true,
                },
            },
        });  
    }

    async findPopular(take: number = 3) {
        const now = new Date();
        const oneMonthAgo = new Date(); 
        oneMonthAgo.setMonth(now.getMonth() - 1);

        return this.repository.createQueryBuilder('book')
            .leftJoin('book.copies', 'copy')
            .leftJoin('copy.borrowRecords', 'borrow', 
                `borrow.borrowed_at >= :startDate AND
                 borrow.status = :borrowStatus  
                `, { startDate: oneMonthAgo, borrowStatus: BorrowStatus.BORROWED })
            .leftJoin('waitlist', 'waitlist', `
                waitlist.book_id = book.id AND
                waitlist.status = :waitlistStatus
            `, { waitlistStatus: WaitlistStatus.REQUESTED })
            .select('book.id', 'id')
            .addSelect('book.title', 'title')
            .addSelect('COUNT(DISTINCT borrow.id)', 'borrow_count')
            .addSelect(`
                COUNT(DISTINCT CASE
                WHEN waitlist."created_at" >= :startDate THEN waitlist.id
                ELSE NULL
                END)
            `, 'waitlist_count')
            .addSelect(`
                COUNT(DISTINCT borrow.id) +
                COUNT(DISTINCT CASE
                WHEN waitlist."created_at" >= :startDate THEN waitlist.id
                ELSE NULL
                END)
            `, 'popularity_score')
            .groupBy('book.id')
            .orderBy('popularity_score', 'DESC')
            .limit(take)
            .setParameter('startDate', oneMonthAgo)
            .getRawMany();
    }
}



export default BookRepository;
