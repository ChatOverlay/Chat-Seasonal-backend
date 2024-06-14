const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const SeasonalUser = require('../models/SeasonalUser');
const { sendVerificationEmail } = require('../services/emailService');

const verificationCodes = {};

const registerSeasonalUser = async (req, res) => {
  const { studentNumber, name, password, email, verificationCode } = req.body;

  if (!verificationCodes[email] || verificationCodes[email] !== verificationCode) {
    return res.status(400).json({ message: 'Invalid or expired verification code.' });
  }

  try {
    let user = await SeasonalUser.findOne({ studentNumber });

    if (user) {
      return res.status(400).json({
        message: '이미 존재하는 사용자입니다.',
      });
    }

    const hashedPassword = await bcrypt.hash(password.toString(), 10); // 비밀번호 해시화
    user = new SeasonalUser({
      studentNumber,
      name,
      password: hashedPassword,
    });
    await user.save();

    const accessToken = jwt.sign(
      { studentNumber: user.studentNumber, id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    // Verification code 사용 후 삭제
    delete verificationCodes[email];

    return res.json({
      message: '회원가입 성공',
      accessToken,
    });
  } catch (error) {
    console.error('회원가입 처리 중 오류 발생:', error);
    res.status(500).json({
      message: '서버 오류로 인해 회원가입을 처리할 수 없습니다.',
    });
  }
};

const loginSeasonalUser = async (req, res) => {
  const { studentNumber, password } = req.body;

  try {
    let user = await SeasonalUser.findOne({ studentNumber });

    if (!user) {
      return res.status(401).json({
        message: '사용자를 찾을 수 없습니다.',
      });
    }

    const isValid = await bcrypt.compare(password.toString(), user.password);
    if (!isValid) {
      return res
        .status(401)
        .json({ message: '인증 실패: 비밀번호가 일치하지 않습니다.' });
    }

    const accessToken = jwt.sign(
      { studentNumber: user.studentNumber, id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.json({
      message: '로그인 성공',
      accessToken,
    });
  } catch (error) {
    console.error('로그인 처리 중 오류 발생:', error);
    res
      .status(500)
      .json({ message: '서버 오류로 인해 로그인을 처리할 수 없습니다.' });
  }
};

const sendVerificationCode = (req, res) => {
  const { email } = req.body;
  const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

  // 임시로 인증 코드 저장
  verificationCodes[email] = verificationCode;

  try {
    sendVerificationEmail(email, verificationCode);
    res.json({ message: 'Verification code sent successfully.' });
  } catch (error) {
    console.error('Error sending verification code:', error);
    res.status(500).json({ message: 'Error sending verification code.' });
  }
};

module.exports = {
  registerSeasonalUser,
  loginSeasonalUser,
  sendVerificationCode,
};
