const SeasonalUser = require('../models/SeasonalUser'); // 모델 임포트 예시
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const loginSeasonalUser = async ({ email, password }) => {
  const user = await SeasonalUser.findOne({ email });
  if (!user) {
    throw new Error('사용자를 찾을 수 없습니다.');
  }

  const isMatch = await bcrypt.compare(password.toString(), user.password);
  if (!isMatch) {
    throw new Error('비밀번호가 일치하지 않습니다.');
  }

  const accessToken = jwt.sign(
    { studentNumber: user.studentNumber, id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: "30d" }
  );

  return { message: '로그인 성공', accessToken };
};

module.exports = loginSeasonalUser;
