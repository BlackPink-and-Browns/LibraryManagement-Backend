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
import http from 'http'
import { Server, Socket } from "socket.io";
import  jwt  from "jsonwebtoken";

interface CustomSocket extends Socket {
  userId?: number;
}

const port = process.env.PORT || 3000;

const app = express();
const logger = LoggerService.getInstance("app()");
const server = http.createServer(app);


const io = new Server(server, {
  cors: {
    origin: "*",
  }
});

io.use((socket: CustomSocket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    return next(new Error('Authentication error'));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET ) as any;
    socket.userId = decoded.id;
    next();
  } catch (err) {
    next(new Error('Authentication error'));
  }
});

io.on('connection', (socket: any) => {
  console.log(`User ${socket.userId} connected with socket ${socket.id}`);
  
  socket.join(`user-${socket.userId}`);

  socket.emit('room-joined', {
    room: `user-${socket.userId}`,
    userId: socket.userId
  });
  
  socket.on('disconnect', () => {
    console.log(`User ${socket.userId} with socket ${socket.id} disconnected`);
  });
});

export {io};

app.use(express.json());
app.use(cors())

app.use(loggerMiddleware);
app.use(processTimeMiddleware);

app.use("/employees",authMiddleware, employeeRouter);
app.use("/departments",authMiddleware,departmentRouter);
app.use("/books",authMiddleware,bookRouter,bookCopyRouter)
app.use("/reviews",authMiddleware,reviewRouter);
app.use("/shelves",authMiddleware,shelfRouter)
app.use("/audits",authMiddleware,auditLogRouter)
app.use("/auth", authRouter);
app.use("/authors", authMiddleware, authorRouter);
app.use("/requests/books", authMiddleware, waitlistRouter);
app.use("/borrows",authMiddleware,borrowRouter);
app.use("/notifications", authMiddleware, notificationRouter);
app.use("/genres",authMiddleware,genreRouter);
app.use("/analytics",authMiddleware,analyticsRouter);

app.use(errorMiddleware);


app.get("/", (req, res) => {
    res.status(200).send("hi");
});

const init = async () => {
    console.log("starting app.ts");
    try {
        await datasource.initialize();
        logger.info("connected to database training");

        server.listen(port, () => {
            logger.info("app listening to " + port);
        });
    } catch(error) {
        logger.error("Failed to connect");
        console.log(error)
        process.exit(1);
    }
};
init();