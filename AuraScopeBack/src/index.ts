import express, { Request, Response } from 'express';
import logger from './logger';


const app = express();
const PORT =3000;

app.use(express.json());

// Manually setting CORS headers
app.use((req: Request, res: Response, next: Function) => {
  res.header('Access-Control-Allow-Origin', '*'); // Allow all origins
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS'); // Allow specific methods
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // Allow specific headers
  next(); // Proceed to the next middleware
});

app.use((req, res, next) => {
  logger.info(`Incoming request: ${req.method} ${req.url}`);
  next();
});

// Main route setup
app.use('/', );
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  logger.info(`Server is running on http://localhost:${PORT}`);
});

export { app };
