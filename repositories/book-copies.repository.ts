import { IntegerType, Repository } from "typeorm";
import { BookCopy } from "../entities/bookcopy.entity";

class BookCopyRepository {
    constructor(private repository: Repository<BookCopy>) {}

    async create(bookCopy: BookCopy): Promise<BookCopy> {
        return this.repository.save(bookCopy);
    }

    async update(id: number, bookCopy): Promise<void> {
        await this.repository.save({ id, ...bookCopy });
    }

    async delete(id: number): Promise<void> {
        await this.repository.delete({ id });
    }

    async findAll(): Promise<BookCopy[]> {
        return this.repository.find({
            select: {
                id: true,
                is_available: true,
                book: {
                    id: true,
                    title: true,
                    isbn: true,
                },
                shelf: {
                    id: true,
                    label: true,
                },
                borrowRecords: {
                    id: true,
                    borrowedBy: true,
                    borrowed_at: true,
                    returned_at: true,
                },
            },
            relations: {
                book: true,
                shelf: true,
                borrowRecords: true,
            },
        });
    }
    async findOneByID(id: number): Promise<BookCopy> {
        return this.repository.findOne({
            where: { id },
            select: {
                id: true,
                is_available: true,
                book: {
                    id: true,
                    title: true,
                    isbn: true,
                },
                shelf: {
                    id: true,
                    label: true,
                },
                borrowRecords: {
                    id: true,
                    borrowedBy: true,
                    borrowed_at: true,
                    returned_at: true,
                },
            },
            relations: {
                book: true,
                shelf: true,
                borrowRecords: true,
            },
        });
    }

    async findCopiesByBookID(id: number): Promise<BookCopy[]> {
        return this.repository.find({
            where: { ...{book: {id:Number(id)}}},
            select: {
                id: true,
                is_available: true,
                book: {
                    id: true,
                    title: true,
                    isbn: true,
                },
                shelf: {
                    id: true,
                    label: true,
                },
                borrowRecords: {
                    id: true,
                    borrowedBy: true,
                    borrowed_at: true,
                    returned_at: true,
                },
            },
            relations: {
                book: true,
                shelf: true,
                borrowRecords: true,
            },
        });
    }

    async findCountByAvailability(is_available: boolean): Promise<IntegerType> {
        return this.repository.count({ where: { is_available: is_available } })
    }
}

export default BookCopyRepository
