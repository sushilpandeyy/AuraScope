import { Router, Request, Response } from 'express';
import { signup, login } from '../functions/login';
import { addtest, getTestsByUserId } from '../functions/test';
const router = Router();

router.get('/', (req: Request, res: Response) => {
    res.send('Welcome to the TypeScript Backend Server!');
});

router.post('/login', (req: Request, res: Response) => {
    login(req,res);
});

// Update the signup route
router.post('/signup', (req: Request, res: Response) => {
    signup(req, res); // Directly call the signup function
});

router.post('/createtest', (req: Request, res: Response) => {
    addtest(req, res); 
});

router.get('/test',(req: Request, res: Response) => {
   getTestsByUserId(req, res);
});

export default router;

