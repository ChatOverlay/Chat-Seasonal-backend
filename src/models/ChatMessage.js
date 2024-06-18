const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema({
  roomId: { type: String, required: true, index: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'SeasonalUser', required: true },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, index: true },
  expiresAt: { type: Date, required: true, index: { expireAfterSeconds: 0 } }, // TTL index
});

// TTL index to automatically delete expired messages
chatMessageSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const ChatMessage = mongoose.model('ChatMessage', chatMessageSchema);

module.exports = ChatMessage;
