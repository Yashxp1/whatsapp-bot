import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  chatId: { type: String, required: true },
  sender: { type: String, required: true },
  content: { type: String, required: true },
  direction: {
    type: String,
    enum: ['inbound', 'outbound'],
    required: true,
  },
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.model('Message', messageSchema);
