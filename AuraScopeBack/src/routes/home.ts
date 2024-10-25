import { Router, Request, Response } from 'express';
import { signup } from '../functions/login'; 
const router = Router();

router.get('/', (req: Request, res: Response) => {
  res.send('Welcome to the TypeScript Backend Server!');
});

router.post('/login', (req: Request, res: Response) => {
    res.send('Login')
})
router.post('/signup', (req: Request, res: Response) => {
    res.send('Signup')
})

export default router;
