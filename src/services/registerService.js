const registerSeasonalUser = async ({
  studentNumber,
  name,
  password,
  email,
  course,
  verificationCode,
}) => {
  if (
    !verificationCodes[email] ||
    verificationCodes[email] !== verificationCode
  ) {
    throw new Error("Invalid or expired verification code.");
  }

  let user = await SeasonalUser.findOne({ studentNumber });

  if (user) {
    throw new Error("이미 존재하는 사용자입니다.");
  }

  const hashedPassword = await bcrypt.hash(password.toString(), 10);
  user = new SeasonalUser({
    studentNumber,
    name,
    nickName: nickName || "무한이", // 별명 필드 추가
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

  delete verificationCodes[email];

  return { message: "회원가입 성공", accessToken };
};

module.exports = registerSeasonalUser;
