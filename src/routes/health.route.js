import { Router } from 'express';

const router = Router();

router.get('/healthy', (req, res) => {
  res.status(200).json({ message: `서버 실행 중 (환경: ${process.env.NODE_ENV}) 포트: ${process.env.PORT}` });
});

export default router;