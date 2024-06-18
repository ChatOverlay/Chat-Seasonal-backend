const SeasonalReport = require('../models/SeasonalReport');
const SeasonalUser = require('../models/SeasonalUser');
const mongoose = require('mongoose');

exports.reportSeasonalUser = async (req, res) => {
  try {
    const { reportedUserId, reason } = req.body;
    const reportedByUserId = req.user.id;

    const reportedUser = await SeasonalUser.findById(reportedUserId);
    if (!reportedUser) {
      return res.status(404).json({ message: '신고된 사용자를 찾을 수 없습니다.' });
    }

    // Check if a report already exists today
    const startOfDay = new Date().setHours(0, 0, 0, 0);
    const endOfDay = new Date().setHours(23, 59, 59, 999);

    const existingReport = await SeasonalReport.findOne({
      reportedUserId,
      reportedByUserId,
      createdAt: { $gte: startOfDay, $lt: endOfDay }
    });

    if (existingReport) {
      return res.status(400).json({ message: '오늘 이미 이 사용자를 신고했습니다.' });
    }

    const report = new SeasonalReport({
      reportedUserId,
      reportedByUserId,
      reason
    });

    await report.save();

    res.status(201).json({ message: '신고가 성공적으로 제출되었습니다. 사유: ' + reason });
  } catch (error) {
    console.error('사용자 신고 중 오류 발생:', error);
    res.status(500).json({ message: '서버 오류' });
  }
};
