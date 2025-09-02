import type { Request, Response } from "express";
import Message from "../model/message";

// Get all messages OR filter by chatId
export const getMessages = async (req: Request, res: Response) => {
  try {
    const chats = await Message.aggregate([
      { $sort: { timestamp: -1 } },
      {
        $group: {
          _id: "$chatId",
          messages: { $push: "$$ROOT" },
        },
      },
      { $sort: { "_id": 1 } },
    ]);

    res.json(chats);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
};
export const addMessage = async (req: Request, res: Response) => {
  try {
    const { chatId, sender, content, direction } = req.body;

    if (!chatId || !sender || !content || !direction) {
      return res.status(400).json({
        error: "chatId, sender, content, and direction are required",
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
    console.error("Error saving message:", error);
    res.status(500).json({ error: "Failed to save message" });
  }
};
