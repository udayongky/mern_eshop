import cors from 'cors';
import dotenv from 'dotenv';
import express, { type Express, type Request, type Response } from 'express';
import helmet from 'helmet';
import mongoose from 'mongoose';
import morgan from 'morgan';

dotenv.config();

/**
 * App Variables
 */

if (!process.env.PORT) {
  process.exit(1);
}

const app: Express = express();
const port = process.env.PORT || 3000;
const apiUrl = process.env.API_URL;

/**
 *  App Configuration
 */

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('tiny'));

app.get(`${apiUrl}/products`, (req: Request, res: Response) => {
  const product = {
    id: 1,
    name: 'hair dresser',
    image: 'some/url',
  };
  res.send(product);
});

app.post(`${apiUrl}/products`, (req: Request, res: Response) => {
  const newProduct = req.body;
  console.log(newProduct);
  res.send(newProduct);
});

mongoose
  .connect(`${process.env.DATABASE_URL}`)
  .then(() => {
    console.log('[database] Database connection is ready...');
  })
  .catch((err) => {
    console.log(err);
  });

app.listen(port, () => {
  console.log(`[server] Server is running at http://localhost:${port}`);
});
