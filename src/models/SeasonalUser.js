const mongoose = require("mongoose");

const seasonalUserSchema = new mongoose.Schema(
  {
    studentNumber: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    nickName: { type: String, default: '무한이' },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    course: { type: String, required: true },
    totalMileage: { type: Number, default: 0 },
    profilePictureUrl: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('SeasonalUser', seasonalUserSchema);
