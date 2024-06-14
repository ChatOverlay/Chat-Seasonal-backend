const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const SeasonalUser = require('../models/SeasonalUser');

const loginSeasonalUser = async ({ studentNumber, password }) => {
  let user = await SeasonalUser.findOne({ studentNumber });

  if (!user) {
    throw new Error('사용자를 찾을 수 없습니다.');
  }

  const isValid = await bcrypt.compare(password.toString(), user.password);
  if (!isValid) {
    throw new Error('인증 실패: 비밀번호가 일치하지 않습니다.');
  }

  const accessToken = jwt.sign(
    { studentNumber: user.studentNumber, id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );

  return { message: '로그인 성공', accessToken };
};

module.exports = loginSeasonalUser;
