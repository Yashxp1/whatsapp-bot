import type { Request, Response } from 'express';
import Message from '../model/message';

export const getMessages = async (req: Request, res: Response) => {
  try {
    const messages = await Message.find().sort({ timestamp: -1 });
    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
};

export const addMessage = async (req: Request, res: Response) => {
  try {
    const { sender, content, direction } = req.body;

    if (!sender || !content || !direction) {
      return res
        .status(400)
        .json({ error: 'sender, content, and direction are required' });
    }

    const message = new Message({
      sender,
      content,
      direction,
      timestamp: new Date(),
    });

    await message.save();
    res.status(201).json(message);
  } catch (error) {
    console.error('Error saving message:', error);
    res.status(500).json({ error: 'Failed to save message' });
  }
};
