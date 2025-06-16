import { Request, Response, Router, NextFunction } from "express";
import WaitlistService from "../services/waitlist.service";

class WaitlistController {
    constructor(private waitlistService: WaitlistService, router: Router) {
        router.post("/:book_id", this.createWaitlist.bind(this));
    }

    async createWaitlist(req: Request, res: Response, next: NextFunction) {
        try {
            const author = await this.waitlistService.createWaitlist(
                Number(req.params.book_id),
                req.user?.id
            );

            res.status(201).send();
        } catch (err) {
            console.log(err);
            next(err);
        }
    }

}

export default WaitlistController;