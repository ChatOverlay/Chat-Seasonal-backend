const express = require('express');
const router = express.Router();
const { reportSeasonalUser } = require('../controllers/seasonalReportController');
const { authenticateToken } = require('../middlewares/authenticateToken');

router.post('/reportUser', authenticateToken, reportSeasonalUser);

module.exports = router;
