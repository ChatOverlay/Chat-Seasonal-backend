// services/adminLoginService.js

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const AdminUser = require('../models/AdminUser');

const adminLogin = async (password) => {
  let user = await AdminUser.findOne();
  if (!user) {
    throw new Error("사용자를 찾을 수 없습니다.");
  }

  // 비밀번호가 일치하는지 확인합니다.
  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    throw new Error("인증 실패: 비밀번호가 잘못되었습니다.");
  }

  // 인증이 성공하면 JWT 토큰을 생성합니다.
  const accessToken = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: "1y" } // 토큰 유효기간 설정
  );

  return {
    message: "로그인 성공",
    accessToken,
  };
};

module.exports = adminLogin;
