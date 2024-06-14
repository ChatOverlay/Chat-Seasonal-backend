const { sendVerificationEmail } = require('./emailService');
const { verificationCodes } = require('./verificationCodes');

const sendVerificationCode = (email) => {
  const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

  verificationCodes[email] = verificationCode;
  sendVerificationEmail(email, verificationCode);
};

module.exports = sendVerificationCode;
