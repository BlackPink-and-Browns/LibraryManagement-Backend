import { Repository } from "typeorm";
import { Waitlist } from "../entities/waitlist.entity";

class WaitlistRepository {
    constructor(private repository: Repository<Waitlist>) {}

    async create(waitlist: Waitlist): Promise<Waitlist> {
        return this.repository.save(waitlist);
    }

}

export default WaitlistRepository;