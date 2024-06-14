const mongoose = require('mongoose');

const mileageLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'SeasonalUser', required: true },
  date: { type: Date, required: true },
  totalMileage: { type: Number, default: 0 },
});

module.exports = mongoose.model('MileageLog', mileageLogSchema);
