import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import messageRouter from './routes/message.route';
import { connectDB } from './config/db';
import { whatsapp } from './lib/wweb';

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

app.use('/api/messages', messageRouter);

app.listen(PORT, () => {
  try {
    whatsapp
    connectDB();
    console.log(`SERVER STARTED ON PORT: ${PORT}`);
  } catch (error: any) {
    console.error('DB CONNECTION FAILED', error);
  }
});
