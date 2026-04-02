import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import taskRoutes from './routes/task.routes';
import { errorHandler } from './middleware/error.middleware';

dotenv.config();

const app = express();

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());


app.use('/auth', authRoutes);
app.use('/tasks', taskRoutes);


app.get('/', (req, res) => {
  res.json({ message: 'Task Management API is running' });
});


app.use(errorHandler);

export default app;
