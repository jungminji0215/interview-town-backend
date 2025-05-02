import express from "express";
import morgan from "morgan";
import categoryRoutes from './routes/category.route.js';
import questionRoutes from './routes/question.route.js';
import answerRoutes from './routes/answer.route.js';
import healthRoute from './routes/health.route.js';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './docs/swagger.js';

const app = express();
const PORT = process.env.PORT || (process.env.NODE_ENV === 'prod' ? 80 : 3001);

app.use(morgan('dev'));
app.use(cors({
  origin: process.env.CORS_WHITELIST,
  credentials: true,
}));

app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(healthRoute);

app.use("/api", categoryRoutes);
app.use('/api', questionRoutes);
app.use('/api', answerRoutes);



app.get("/", (req, res) => {
  res.send(`서버 실행 중 (환경: ${process.env.NODE_ENV}) 포트: ${PORT}`)
})

 app.listen(PORT, () => {
   console.log(`서버 실행 중 (환경: ${process.env.NODE_ENV}) 포트: ${PORT}`);
});

