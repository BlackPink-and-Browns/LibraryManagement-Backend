import { Request, Response, Router, NextFunction } from "express";
import httpException from "../exceptions/http.exception";
import NotificationService from "../services/notification.service";
import { Notification } from "../entities/notification.entity";

class NotificationController {
  constructor(
    private notificationService: NotificationService,
    router: Router
  ) {
    router.get("/", this.getAllNotificationsByEmployee.bind(this));
    router.patch("/:id", this.updateNotification.bind(this));
  }

  async getAllNotificationsByEmployee(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { read } = req.query;
      const finalRead = read ? read : "";
      if (!["true", "false"].includes(finalRead) && finalRead != "") {
        throw new httpException(400, "Ivalid input for query param 'read'");
      }
      const notifications: Notification[] =
        await this.notificationService.getAllNoticationByEmployeeId(
          req.user?.id,
          finalRead ? (finalRead === "true" ? true : false) : ""
        );
      res.status(200).send(notifications);
    } catch (err) {
      console.log(err);
      next(err);
    }
  }

  async updateNotification(req: Request, res: Response, next: NextFunction) {
    try {
      await this.notificationService.updateNotification(
        req.user?.id,
        Number(req.params.id)
      );

      res.status(200).send();
    } catch (err) {
      console.log(err);
      next(err);
    }
  }
}

export default NotificationController;
