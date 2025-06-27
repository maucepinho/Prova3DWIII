import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import reservaRoutes from './routes/reservaRoutes';

dotenv.config();

const app: Application = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rotas
app.use('/api/reservas', reservaRoutes);

// Health check
app.get('/health', (req: Request, res: Response) => {
    res.status(200).json({ status: 'OK' });
});

// Conexão com MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/reserva';
mongoose.connect(MONGODB_URI)
    .then(() => console.log('Conectado ao MongoDB'))
    .catch(err => console.error('Erro ao conectar ao MongoDB:', err));

// Middleware de erro global
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Erro interno do servidor' });
});

export default app;