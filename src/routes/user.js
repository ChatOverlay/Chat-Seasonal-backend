const express = require('express');
const {
  getUserInfo,
  updateNickName,
  uploadProfilePicture,
  resetProfilePicture,
  upload
} = require('../controllers/userController');
const { authenticateToken } = require('../middlewares/authenticateToken');

const router = express.Router();

router.get('/info', authenticateToken, getUserInfo);
router.post('/update-nickname', authenticateToken, updateNickName);
router.post('/upload-profile-picture', authenticateToken, upload.single('profilePicture'), uploadProfilePicture);
router.delete('/reset-profile-picture', authenticateToken, resetProfilePicture);

module.exports = router;
