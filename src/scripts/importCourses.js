const mongoose = require('mongoose');
const xlsx = require('xlsx');
const dotenv = require('dotenv');
const connectDB = require('../config/db');
const SeasonCourse = require('../models/SeasonCourse');

dotenv.config();

const filePath = './시간표 및 강의계획서 목록.xlsx'; // 파일 경로

const importCoursesFromExcel = async () => {
  // MongoDB 연결
  await connectDB();

  // 엑셀 파일 읽기
  const workbook = xlsx.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];

  // 엑셀 데이터를 JSON 형식으로 변환
  const courses = xlsx.utils.sheet_to_json(worksheet);

  for (const course of courses) {
    // 필수 필드 검증
    const courseCode = course['학수번호'];
    const courseName = course['교과목명'];
    const professor = course['담당교수'];
    const lectureTime = course['강의시간'];
    const lectureRoom = course['강의실'];

    if (!courseCode || !courseName || !professor || !lectureTime || !lectureRoom) {
      console.warn(`Skipping course due to missing fields: ${JSON.stringify(course)}`);
      continue;
    }

    const newCourse = { courseCode, courseName, professor, lectureTime, lectureRoom };

    try {
      // 중복 여부 확인 후 데이터베이스에 저장
      const existingCourse = await SeasonCourse.findOne({ courseCode: newCourse.courseCode });
      if (!existingCourse) {
        const courseDocument = new SeasonCourse(newCourse);
        await courseDocument.save();
      }
    } catch (error) {
      console.error(`Error saving course ${newCourse.courseCode}:`, error);
    }
  }

  mongoose.connection.close();
  console.log('Courses imported successfully');
};

importCoursesFromExcel().catch(err => {
  console.error('Error importing courses:', err);
  mongoose.connection.close();
});
