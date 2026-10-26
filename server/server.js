import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';

const app = express();
app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173' }));
app.use(express.json({ limit: '20kb' }));
app.get('/api/health', (_req, res) => res.json({ status: 'ok', service: 'CampusSync MVC API' }));
app.use('/api/auth', authRoutes);
app.use((err, _req, res, _next) => { console.error(err); res.status(500).json({ message: 'Unexpected server error.' }); });

const port = Number(process.env.PORT || 5000);
connectDB().then(() => app.listen(port, () => console.log(`CampusSync API listening on ${port}`)))
  .catch((error) => { console.error(`Startup failed: ${error.message}`); process.exit(1); });
