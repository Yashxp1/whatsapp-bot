import express from 'express';
import { addMessage, getMessages } from '../controller/message.controller';

const messageRouter = express.Router();

messageRouter.get('/', getMessages);
messageRouter.post('/', addMessage);

export default messageRouter;
