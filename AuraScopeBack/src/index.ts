import express, { Request, Response } from 'express';
import homeRouter from './routes/home';
import { spawn } from 'child_process';
import "dotenv/config"
import { getQuestionsByTestId } from './functions/test';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Manually setting CORS headers
app.use((req: Request, res: Response, next: Function) => {
  res.header('Access-Control-Allow-Origin', '*'); // Allow all origins
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS'); // Allow specific methods
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // Allow specific headers
  next(); // Proceed to the next middleware
});

// Main route setup
app.use('/', homeRouter);
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

export { app };
