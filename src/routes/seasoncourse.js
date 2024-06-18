const express = require('express');
const { getAllCourses, getCourseById } = require('../controllers/seasonCourseController');

const router = express.Router();

// 모든 코스 가져오기
router.get('/', getAllCourses);

// 특정 코스 가져오기
router.get('/:courseId', getCourseById);

module.exports = router;
