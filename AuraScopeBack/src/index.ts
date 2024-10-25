import express, { Request, Response } from 'express';
import homeRouter from './routes/home';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Main route setup
app.use('/', homeRouter);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
