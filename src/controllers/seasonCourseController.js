const SeasonCourse = require("../models/SeasonCourse");

// 모든 코스 가져오기
const getAllCourses = async (req, res) => {
  try {
    const courses = await SeasonCourse.find().select("courseName");
    res.json(courses);
  } catch (error) {
    res
      .status(500)
      .json({ message: "코스를 가져오는 중 오류가 발생했습니다.", error });
  }
};

module.exports = {
  getAllCourses,
};
