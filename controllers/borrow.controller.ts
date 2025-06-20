import { Request, Response, Router, NextFunction } from "express";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import BorrowService from "../services/borrow.service";
import httpException from "../exceptions/http.exception";
import { CreateBorrowDto } from "../dto/borrow/create-borrow.dto";
import { ReturnBorrowDto } from "../dto/borrow/return-borrow.dto";
import { BorrowStatus } from "../entities/enums";
import EmployeeService from "../services/employee.service";

class BorrowController {
  constructor(
    private borrowService: BorrowService,
    private employeeService: EmployeeService,
    router: Router
  ) {
    router.post("/", this.borrowBook.bind(this));
    router.patch("/:borrow_id", this.returnBook.bind(this));
    router.patch("/update_status/:borrow_id", this.reborrowBook.bind(this));
    router.get("/overdue/alerts", this.getOverdueAlerts.bind(this));
    router.get("/overdue/check/", this.checkAndReturnOverdues.bind(this));
    router.get("/books", this.getBorrowListByStatus.bind(this));
    router.get("/all/borrowed", this.getAllBorrowedRecords.bind(this));
  }

  async borrowBook(req: Request, res: Response, next: NextFunction) {
    try {
      const createDto = plainToInstance(CreateBorrowDto, req.body);
      const errors = await validate(createDto);
      if (errors.length > 0) {
        throw new httpException(400, JSON.stringify(errors));
      }

      const result = await this.borrowService.borrowBook(
        createDto,
        req.user?.id
      );
      res.status(201).send(result);
    } catch (err) {
      next(err);
    }
  }

  async returnBook(req: Request, res: Response, next: NextFunction) {
    try {
      const returnDto = plainToInstance(ReturnBorrowDto, req.body);
      const errors = await validate(returnDto);
      if (errors.length > 0) {
        throw new httpException(400, JSON.stringify(errors));
      }

      const borrowId = req.params.borrow_id;
      const returnShelfId = returnDto.returned_shelf_no;

      const updatedRecord = await this.borrowService.returnBook(
        borrowId,
        returnShelfId,
        req.user?.id
      );

      res.status(200).send(updatedRecord);
    } catch (err) {
      next(err);
    }
  }

  async getOverdueAlerts(req: Request, res: Response, next: NextFunction) {
    try {
      const alerts = await this.borrowService.getOverdueAlerts();
      res.status(200).send(alerts);
    } catch (err) {
      next(err);
    }
  }

  async reborrowBook(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.borrow_id);
      const result = await this.borrowService.reborrowOverdueBook(
        id,
        req.user?.id
      );
      res.status(200).send(result);
    } catch (err) {
      next(err);
    }
  }

  // POST /books/overdue/check/:employeeId
  async checkAndReturnOverdues(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      // const employeeId = parseInt(req.params.employeeId);
      // if (isNaN(employeeId)) {
      //   throw new Error("Invalid employee ID");
      // }
      const employeeId = req.user.id;
      const { result, count } = await this.borrowService.checkAndReturnOverdues(
        employeeId,
        employeeId
      );

      res.status(200).json({
        message: `Checked overdue books for employee ${employeeId}`,
        overdued_books: result,
        count,
      });
    } catch (error) {
      next(error);
    }
  }

  async getBorrowListByStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { status } = req.query;
      const userId = req.user?.id;

      if (!status || !userId) {
        throw new httpException(
          400,
          "Status and authenticated user ID required"
        );
      }

      const borrows = await this.borrowService.getBorrowsByStatus(
        userId,
        status as BorrowStatus
      );

      res.status(200).send(borrows);
    } catch (err) {
      next(err);
    }
  }

  async getAllBorrowedRecords(req: Request, res: Response, next: NextFunction) {
    try {
      const records = await this.borrowService.getBorrowsByStatusForAllUsers(
        BorrowStatus.BORROWED
      );
      res.status(200).json({
        message: "Fetched all borrow records with status BORROWED",
        count: records.length,
        records,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default BorrowController;
