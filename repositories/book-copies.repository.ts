import { Repository } from "typeorm";
import { BookCopy } from "../entities/bookcopy.entity";

class BookCopyRepository {
    constructor (private repository: Repository<BookCopy>) {}

    // async create ()
}