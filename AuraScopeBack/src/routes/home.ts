import { Router, Request, Response } from 'express';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  res.send('Welcome to the TypeScript Backend Server!');
});

router.post('/login', (req: Request, res: Response) => {
    res.send('Login')
})
router.post('/Signup', (req: Request, res: Response) => {
    res.send('Signup')
})

export default router;
