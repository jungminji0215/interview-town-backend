import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import categoriesRouter from "./router/categoriesRouter.js";
import tagsRouter from "./router/tagsRouter.js";
import questionsRouter from "./router/questionsRouter.js";
import answersRouter from "./router/answersRouter.js";
import authRouter from "./router/authRouter.js";
import { db } from "./db/database.js";
import { Server } from "socket.io";

const app = express();
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(morgan("tiny"));

/** 서버 구동 테스트 */
app.use("/", (req, res) => {
  res.send(`.env 테스트 : ${process.env.DB_USER}`);
});

app.use("/categories", categoriesRouter);
app.use("/tags", tagsRouter);
app.use("/questions", questionsRouter);
app.use("/answers", answersRouter);
app.use("/auth", authRouter);

app.use((req, res, next) => {
  res.sendStatus(404);
});

app.use((error, req, res, next) => {
  console.error(error);
  res.sendStatus(500);
});

db.getConnection().then((connection) => console.log("DB 연결 성공"));

const server = app.listen(8080, () => {
  console.log("서버가 8080번 포트에서 실행 중입니다.");
});

const io = new Server(server, {
  cors: { origin: "*" }, // 임시로 모든 도메인 허용
});

app.locals.io = io;

io.on("connection", (socket) => {
  console.log("클라이언트 연결:", socket.id);

  socket.on("joinRoom", (questionId) => {
    console.log(`Socket ${socket.id} joining room for question ${questionId}`);
    socket.join(`question_${questionId}`);
  });
});
