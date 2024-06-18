const mongoose = require("mongoose");

const seasonalReportSchema = new mongoose.Schema({
  reportedUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SeasonalUser",
    required: true,
  },
  reportedByUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SeasonalUser",
    required: true,
  },
  reason: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("SeasonalReport", seasonalReportSchema);
