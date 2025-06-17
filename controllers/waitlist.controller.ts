import { Request, Response, Router, NextFunction } from "express";
import WaitlistService from "../services/waitlist.service";
import { Book } from "../entities/book.entity";
import { Waitlist } from "../entities/waitlist.entity";

class WaitlistController {
  constructor(private waitlistService: WaitlistService, router: Router) {
    router.post("/:book_id", this.createWaitlist.bind(this));
    router.get("/", this.getAllWaitlistsByEmployee.bind(this));
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

  async getAllWaitlistsByEmployee(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const waitlists: Waitlist[] =
        await this.waitlistService.getAllWaitlistByEmployeeId(req.user?.id);
      res.status(200).send(waitlists);
    } catch (err) {
      console.log(err);
      next(err);
    }
  }
}

export default WaitlistController;
