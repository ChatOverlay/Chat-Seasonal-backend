const SeasonCourse = require("../models/SeasonCourse");

// 모든 코스 가져오기
const getAllCourses = async (req, res) => {
  try {
    const courses = await SeasonCourse.find().select("courseName courseCode professor");
    res.json(courses);
  } catch (error) {
    console.error("Error fetching all courses:", error); // 에러 로그 추가
    res.status(500).json({ message: "코스를 가져오는 중 오류가 발생했습니다.", error });
  }
};

// 특정 코스 가져오기
const getCourseById = async (req, res) => {
  try {
    const course = await SeasonCourse.findOne({ courseCode: req.params.courseId }).select("courseName courseCode professor lectureTime lectureRoom");
    if (!course) {
      return res.status(404).json({ message: "코스를 찾을 수 없습니다." });
    }
    res.json(course);
  } catch (error) {
    console.error('Error fetching course:', error); // 에러 로그 출력
    res.status(500).json({ message: "코스를 가져오는 중 오류가 발생했습니다.", error });
  }
};

module.exports = {
  getAllCourses,
  getCourseById,
};
