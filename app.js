import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import categoriesRouter from "./router/categoriesRouter.js";
import tagsRouter from "./router/tagsRouter.js";
import questionsRouter from "./router/questionsRouter.js";
import answersRouter from "./router/answersRouter.js";
import { db } from "./db/database.js";
import { Server } from "socket.io";

const app = express();
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(morgan("tiny"));

app.use("/categories", categoriesRouter);
app.use("/tags", tagsRouter);
app.use("/questions", questionsRouter);
app.use("/answers", answersRouter);

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

const socketIO = new Server(server, {
  cors: { origin: "*" }, // 임시로 모든 도메인 허용
});

app.locals.io = socketIO;

socketIO.on("connection", (socket) => {
  console.log("클라이언트 연결:", socket.id);
  socketIO.emit("answer", "답변입니다~~!!");
});
