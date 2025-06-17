import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db';
import routes from './routes/routes'

const app = express();
const PORT = 5000;

dotenv.config();
connectDB()

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));

app.use(express.json());

app.use('/',routes)

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
