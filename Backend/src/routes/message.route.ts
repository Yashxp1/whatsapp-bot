import express from 'express';
import {
  addMessage,
  getCustomInstructions,
  getMessages,
  saveCustomInstructions,
} from '../controller/message.controller';

const messageRouter = express.Router();

messageRouter.get('/', getMessages);
messageRouter.post('/', addMessage);

messageRouter.post('/instruction', saveCustomInstructions);
messageRouter.get('/instruction', getCustomInstructions);

export default messageRouter;
