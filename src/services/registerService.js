const SeasonalUser = require('../models/SeasonalUser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const registerSeasonalUser = async ({
  studentNumber,
  name,
  password,
  email,
  course,
  nickName = "무한이",
}) => {
  try {
    // 중복된 studentNumber 체크
    let user = await SeasonalUser.findOne({ studentNumber });
    if (user) {
      throw new Error("이미 존재하는 학번입니다.");
    }

    // 중복된 email 체크
    user = await SeasonalUser.findOne({ email });
    if (user) {
      throw new Error("이미 사용 중인 이메일입니다.");
    }

    // 비밀번호 해싱
    const hashedPassword = await bcrypt.hash(password.toString(), 10);
    user = new SeasonalUser({
      studentNumber,
      name,
      nickName,
      password: hashedPassword,
      email,
      course,
    });

    await user.save();

    // JWT 토큰 생성
    const accessToken = jwt.sign(
      { studentNumber: user.studentNumber, id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    return { message: "회원가입 성공", accessToken };
  } catch (error) {
    console.error("회원가입 오류:", error);
    throw error;
  }
};

module.exports = registerSeasonalUser;
