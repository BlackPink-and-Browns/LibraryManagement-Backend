import express from "express";
import employeeRouter from "./routes/employee.route";
import loggerMiddleware from "./loggerMiddleware";
import datasource from "./db/data-source";
import processTimeMiddleware from "./processTimeMiddleware";
import errorMiddleware from "./middlewares/error.middleware";
import authRouter from "./routes/auth.route";
import authMiddleware from "./middlewares/auth.middleware";
import { LoggerService } from "./services/logger.service";
import departmentRouter from "./routes/department.route";
import cors from 'cors'
import authorRouter from "./routes/author.route";
import reviewRouter from "./routes/review.route";
import auditLogRouter from "./routes/audit.route";
import waitlistRouter from "./routes/waitlist.route";
import shelfRouter from "./routes/shelf.route";
import bookRouter from "./routes/book.route";
import bookCopyRouter from "./routes/book-copy.route";
import borrowRouter from "./routes/borrow.route";
import notificationRouter from "./routes/notification.route";
import genreRouter from "./routes/genre.route";
import analyticsRouter from "./routes/analytics.route";

const port = process.env.PORT || 3000;

const server = express();
const logger = LoggerService.getInstance("app()");


server.use(express.json());
server.use(loggerMiddleware);
server.use(processTimeMiddleware);
server.use(cors())
server.use("/employees",authMiddleware, employeeRouter);
server.use("/departments",authMiddleware,departmentRouter);
server.use("/books",authMiddleware,bookRouter,bookCopyRouter)
server.use("/reviews",authMiddleware,reviewRouter);
server.use("/shelves",authMiddleware,shelfRouter)
server.use("/audits",authMiddleware,auditLogRouter)
server.use("/auth", authRouter);
server.use("/authors", authMiddleware, authorRouter);
server.use("/requests/books", authMiddleware, waitlistRouter);
server.use("/borrows",authMiddleware,borrowRouter);
server.use("/notifications", authMiddleware, notificationRouter);
server.use("/genres",authMiddleware,genreRouter);
server.use("/analytics",authMiddleware,analyticsRouter);
server.use(errorMiddleware);



server.get("/", (req, res) => {
    res.status(200).send("hi");
});

const init = async () => {
    console.log("starting app.ts");
    try {
        await datasource.initialize();
        logger.info("connected to database training");

        server.listen(port, () => {
            logger.info("server listening to " + port);
        });
    } catch(error) {
        logger.error("Failed to connect");
        console.log(error)
        process.exit(1);
    }
};

init();
