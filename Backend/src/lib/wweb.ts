import { Client, LocalAuth } from 'whatsapp-web.js';
import Message from '../model/message';
import { generateReply } from './generateReply';
import { Server } from 'socket.io';

export const initWhatsapp = (io: Server) => {
  const whatsapp = new Client({
    authStrategy: new LocalAuth(),
  });

  whatsapp.on('qr', (qr) => {
    console.log('QR received');
    io.emit('qr', qr);
  });

  whatsapp.on('ready', () => {
    console.log('Client is ready');
    io.emit('ready');
  });

  whatsapp.on('message', async (msg) => {
    if (!msg.body) return;

    console.log('message body:', msg.body);

    try {
      const userMessage = new Message({
        chatId: msg.from,
        sender: msg.from,
        content: msg.body,
        direction: 'inbound',
        timestamp: new Date(),
      });
      await userMessage.save();

      const reply = await generateReply(msg.body);

      await msg.reply(reply);

      const botMessage = new Message({
        chatId: msg.from,
        sender: 'APEX',
        content: reply,
        direction: 'outbound',
        timestamp: new Date(),
      });
      await botMessage.save();
    } catch (error) {
      console.error('Error handling message:', error);
    }
  });

  whatsapp.initialize();
};
