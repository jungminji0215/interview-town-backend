import { Router } from 'express';

const router = Router();

router.get('/healthy', (req, res) => {
  res.status(200).json({ message: 'OK' });
});

export default router;