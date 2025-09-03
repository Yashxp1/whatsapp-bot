import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import messageRouter from './routes/message.route';
import { initWhatsapp } from './lib/wweb';
import { connectDB } from './config/db';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

app.use('/api/messages', messageRouter);

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: '*',
  },
});

initWhatsapp(io);

httpServer.listen(PORT, async () => {
  try {
    await connectDB();
    console.log(`SERVER STARTED ON PORT: ${PORT}`);
  } catch (error: any) {
    console.error('DB CONNECTION FAILED', error);
  }
});
