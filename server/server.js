import dns from 'node:dns';

dns.setServers(['8.8.8.8', '8.8.4.4']);
import 'dotenv/config';
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';import aiRoutes from './routes/aiRoutes.js';
import committeeRoutes from './routes/committeeRoutes.js';
import applicationRoutes from './routes/applicationRoutes.js';
import slotRoutes from './routes/slotRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';
import grievanceRoutes from './routes/grievanceRoutes.js';
import candidateRoutes from './routes/candidateRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientDistPath = path.resolve(__dirname, '../client/dist');
const app = express();
app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173', credentials: true }));
app.use(express.json({ limit: '20kb' }));
app.get('/api/health', (_req, res) => res.json({ status: 'ok', service: 'CampusSync API' }));
app.use('/api/auth', authRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/committees', committeeRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/slots', slotRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/grievances', grievanceRoutes);
app.use('/api/candidates', candidateRoutes);
app.use('/api/notifications', notificationRoutes);

app.use(express.static(clientDistPath));
app.get('*', (req, res, next) => { if (req.path.startsWith('/api')) return next(); res.sendFile(path.join(clientDistPath, 'index.html')); });
app.use((err, _req, res, _next) => { console.error(err); res.status(500).json({ message: 'Unexpected server error.' }); });
const port = Number(process.env.PORT || 3000);
connectDB().then(() => app.listen(port, '0.0.0.0', () => console.log(`CampusSync API listening on port ${port}`)))
  .catch((error) => { console.error('MongoDB connection failed; server not started:', error.message); process.exit(1); });
