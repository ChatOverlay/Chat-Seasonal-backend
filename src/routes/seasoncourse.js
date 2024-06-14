const express = require('express');
const { getAllCourses } = require('../controllers/seasonCourseController');

const router = express.Router();

// 모든 코스 가져오기
router.get('/', getAllCourses);

module.exports = router;
