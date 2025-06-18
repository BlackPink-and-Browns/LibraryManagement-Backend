import { Request, Response, Router, NextFunction } from "express";
import WaitlistService from "../services/waitlist.service";
import { Book } from "../entities/book.entity";
import { Waitlist } from "../entities/waitlist.entity";
import { WaitlistStatus } from "../entities/enums";
import httpException from "../exceptions/http.exception";
import { DeleteWaitlistRequestsDto } from "../dto/waitlist/delete-multi-waitlist.dto";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";

class WaitlistController {
  constructor(private waitlistService: WaitlistService, router: Router) {
    router.post("/:book_id", this.createWaitlist.bind(this));
    router.get("/", this.getAllWaitlistsByEmployee.bind(this));
    router.patch("/", this.removeWaitlist.bind(this));
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
      const {status} = req.query;
      const finalStatus = status ? String(status).trim() : '';
      if ( !Object.values(WaitlistStatus).includes(finalStatus as WaitlistStatus) && finalStatus != "" ){
        throw new httpException(400, "Ivalid input for query param 'status'")
      } 
      const waitlists: Waitlist[] =
        await this.waitlistService.getAllWaitlistByEmployeeId(
            req.user?.id,
            finalStatus as WaitlistStatus
        );
      res.status(200).send(waitlists);
    } catch (err) {
      console.log(err);
      next(err);
    }
  }

  async removeWaitlist(req: Request, res: Response, next: NextFunction) {
    try {
      const deleteWaitlistRequestsDto = plainToInstance(
          DeleteWaitlistRequestsDto,
          req.body
      );
      const errors = await validate(deleteWaitlistRequestsDto);
      if (errors.length > 0) {
          console.log(JSON.stringify(errors));
          throw new httpException(404, JSON.stringify(errors));
      }
      await this.waitlistService.updateWaitlist(
          req.user?.id,
          deleteWaitlistRequestsDto
      );

      res.status(200).send();
    } catch (err) {
      console.log(err);
      next(err);
    }
  }

}

export default WaitlistController;
