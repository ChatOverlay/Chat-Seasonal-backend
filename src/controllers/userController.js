const SeasonalUser = require('../models/SeasonalUser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');

// 프로필 사진 업로드 설정
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage: storage });

const getUserInfo = async (req, res) => {
  const userId = req.user.id;

  try {
    const user = await SeasonalUser.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user info', error });
  }
};

const updateNickName = async (req, res) => {
  const userId = req.user.id;
  const { nickName } = req.body;

  try {
    const user = await SeasonalUser.findByIdAndUpdate(
      userId,
      { nickName },
      { new: true }
    );
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error updating nickname', error });
  }
};

const uploadProfilePicture = async (req, res) => {
  const userId = req.user.id;
  const profilePictureUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

  try {
    const user = await SeasonalUser.findByIdAndUpdate(
      userId,
      { profilePictureUrl },
      { new: true }
    );
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error uploading profile picture', error });
  }
};

const resetProfilePicture = async (req, res) => {
  const userId = req.user.id;

  try {
    const user = await SeasonalUser.findByIdAndUpdate(
      userId,
      { profilePictureUrl: '' },
      { new: true }
    );
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error resetting profile picture', error });
  }
};

module.exports = {
  getUserInfo,
  updateNickName,
  uploadProfilePicture,
  resetProfilePicture,
  upload
};
