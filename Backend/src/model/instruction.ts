import mongoose from 'mongoose';

const CustomInstructionSchema = new mongoose.Schema({
  instructions: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
 
});

export default mongoose.model('Instruction', CustomInstructionSchema);