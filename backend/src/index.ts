import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
import connectDB from './config/db';
import routes from './routes/routes'
import cookieParser from 'cookie-parser'
import { requestLogger } from './middlewares/logger.middleware';

const app = express();
const PORT = 5000;

connectDB()

app.use(cookieParser())

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
app.use(requestLogger)
app.use(express.json());

app.use('/',routes)

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
