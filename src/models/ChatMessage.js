const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema({
  roomId: { type: String, required: true, index: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, index: true },
  expiresAt: { type: Date, required: true, index: { expireAfterSeconds: 0 } }, // TTL 인덱스 설정
});

// TTL 인덱스를 통해 만료된 메시지를 자동으로 삭제
chatMessageSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const ChatMessage = mongoose.model('ChatMessage', chatMessageSchema);

module.exports = ChatMessage;
