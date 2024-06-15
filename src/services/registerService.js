const SeasonalUser = require('../models/SeasonalUser'); // 모델 임포트 예시
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const registerSeasonalUser = async ({
  studentNumber,
  name,
  password,
  email,
  course,
  nickName = "무한이", // 기본 별명 설정
}) => {

  let user = await SeasonalUser.findOne({ studentNumber });

  if (user) {
    throw new Error("이미 존재하는 사용자입니다.");
  }

  const hashedPassword = await bcrypt.hash(password.toString(), 10);
  user = new SeasonalUser({
    studentNumber,
    name,
    nickName, // 별명 필드 추가
    password: hashedPassword,
    email,
    course, // 코스 필드 추가
  });

  await user.save();

  const accessToken = jwt.sign(
    { studentNumber: user.studentNumber, id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: "30d" }
  );

  return { message: "회원가입 성공", accessToken };
};

module.exports = registerSeasonalUser;
