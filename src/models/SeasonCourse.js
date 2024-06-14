const mongoose = require('mongoose');

const SeasonCourseSchema = new mongoose.Schema(
  {
    courseCode: { type: String, required: true, unique: true },  // 학수번호
    courseName: { type: String, required: true },  // 교과목명
    professor: { type: String, required: true },  // 담당교수
    lectureTime: { type: String, required: true },  // 강의시간
    lectureRoom: { type: String, required: true },  // 강의실
  },
  { timestamps: true }
);

module.exports = mongoose.model('SeasonCourse', SeasonCourseSchema);
