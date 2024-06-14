const mongoose = require("mongoose");

const seasonalUserSchema = new mongoose.Schema(
  {
    studentNumber: { type: Number, required: true, unique: true },  // 학번 추가
    name: { type: String, required: true },  // 이름 추가
    nickName: { type: String, default: '무한이' },
    password: { type: Number, required: true },  // 숫자로 저장
    totalMileage: { type: Number, default: 0 },
    profilePictureUrl: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('SeasonalUser', seasonalUserSchema);
