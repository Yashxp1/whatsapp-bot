import { Client, LocalAuth } from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';
import Message from '../model/message';
import { generateReply } from './generateReply';

export const whatsapp = new Client({
  authStrategy: new LocalAuth(),
});

whatsapp.on('qr', (qr) => {
  qrcode.generate(qr, { small: true });
});

whatsapp.on('message', async (msg) => {
  if (!msg.body) return;

  console.log('message body:', msg.body);

  try {
    const userMessage = new Message({
      sender: msg.from,
      content: msg.body,
      direction: 'inbound',
      timestamp: new Date(),
    });
    await userMessage.save();

    const reply = await generateReply(msg.body);

    await msg.reply(reply);

    const botMessage = new Message({
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

whatsapp.on('ready', () => {
  console.log('Client is ready');
});

whatsapp.initialize();
