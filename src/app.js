import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import categoryRoutes from './routes/category.route.js';


import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './docs/swagger.js';
//
// import dotenv from 'dotenv';
// dotenv.config();

import tagsRouter from "./routes/tagsRouter.js";
import questionsRouter from "./routes/questionsRouter.js";
import answersRouter from "./routes/answersRouter.js";
import authRouter from "./routes/authRouter.js";
import { db } from "./db/database.js";
import { Server } from "socket.io";

const app = express();
const PORT = process.env.PORT || (process.env.NODE_ENV === 'production' ? 80 : 3001);

app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// app.use(helmet());
// app.use(cors());
// app.use(morgan("tiny"));
//
// /** 서버 구동 테스트 */
// app.use("/healthy", (req, res) => {
//   res.status(200).send("success healthy");
// });
//
//
app.use("/api", categoryRoutes);
// app.use("/tags", tagsRouter);
// app.use("/questions", questionsRouter);
// app.use("/answers", answersRouter);
// app.use("/auth", authRouter);
//
// app.use((req, res, next) => {
//   res.sendStatus(404);
// });
//
// app.use((error, req, res, next) => {
//   console.error(error);
//   res.sendStatus(500);
// });
//
// db.getConnection().then((connection) => console.log("DB 연결 성공"));


 app.listen(PORT, () => {
   console.log(`✅ 서버 실행 중 (환경: ${process.env.NODE_ENV}) 포트: ${PORT}`);
});

