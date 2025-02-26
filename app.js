import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import categoriesRouter from "./router/categoriesRouter.js";
import tagsRouter from "./router/tags.js";
import questionsRouter from "./router/questions.js";
import answersRouter from "./router/answers.js";
import { db } from "./db/database.js";

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

app.listen(8080);
