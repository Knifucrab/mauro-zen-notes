import express from 'express';
import cors from 'cors';
import notesRouter from './notes';
import tagsRouter from './tags';
import authRouter from './auth';
import { AppDataSource } from './data-source';
import { authMiddleware } from './middleware/auth';


const app = express();
app.use(cors({ origin: ['http://localhost:3000', 'http://localhost:5173'], credentials: true }));
app.use(express.json());

// Public routes
app.use('/auth', authRouter);

// Protected routes
app.use('/notes', authMiddleware, notesRouter);
app.use('/tags', authMiddleware, tagsRouter);

const PORT = process.env.PORT || 3000;
AppDataSource.initialize().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch((error) => {
  console.error('Error during Data Source initialization:', error);
});
