import type { Request, Response } from 'express';
import Message from '../model/message';
import Instruction from '../model/instruction';
import { generateReply } from '../lib/generateReply';

// Get all messages OR filter by chatId
export const getMessages = async (req: Request, res: Response) => {
  try {
    const chats = await Message.aggregate([
      { $sort: { timestamp: -1 } },
      {
        $group: {
          _id: '$chatId',
          messages: { $push: '$$ROOT' },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json(chats);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
};

export const addMessage = async (req: Request, res: Response) => {
  try {
    const { chatId, sender, content, direction } = req.body;

    if (!chatId || !sender || !content || !direction) {
      return res.status(400).json({
        error: 'chatId, sender, content, and direction are required',
      });
    }

    const message = new Message({
      chatId,
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

// Save custom instructions
export const saveCustomInstructions = async (req: Request, res: Response) => {
  try {
    const { instructions } = req.body;

    if (!instructions || typeof instructions !== 'string') {
      return res.status(400).json({
        error: 'Instructions are required and must be a string'
      });
    }

    // Delete existing instructions (if you want only one active instruction)
    await Instruction.deleteMany({});

    // Save new instructions
    const instructionDoc = new Instruction({
      instructions: instructions.trim(),
      createdAt: new Date(),
    });
    
    await instructionDoc.save();

    res.json({ message: 'Custom instructions saved successfully' });
  } catch (error) {
    console.error('Error saving custom instructions:', error);
    res.status(500).json({ error: 'Failed to save custom instructions' });
  }
};

// Get current custom instructions
export const getCustomInstructions = async (req: Request, res: Response) => {
  try {
    // Get the most recent instruction
    const instructionDoc = await Instruction.findOne().sort({ createdAt: -1 });
    
    const instructions = instructionDoc ? instructionDoc.instructions : '';
    
    res.json({ instructions });
  } catch (error) {
    console.error('Error getting custom instructions:', error);
    res.status(500).json({ error: 'Failed to get custom instructions' });
  }
};

// Legacy function - keeping for backward compatibility
export const setInstruction = async (req: Request, res: Response) => {
  try {
    const { systemInstruction } = req.body;

    if (!systemInstruction || typeof systemInstruction !== 'string') {
      return res.status(400).json({
        error: 'systemInstruction is required and must be a string'
      });
    }

    // Delete existing instructions
    await Instruction.deleteMany({});

    // Save new instructions
    const instructionDoc = new Instruction({
      instructions: systemInstruction.trim(),
      createdAt: new Date(),
    });
    
    await instructionDoc.save();

    res.json({ message: 'Custom instructions saved successfully' });
  } catch (error) {
    console.error('Error saving instruction:', error);
    res.status(500).json({ error: 'Failed to save instruction' });
  }
};