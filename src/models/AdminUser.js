const mongoose = require('mongoose');

const AdminUserSchema = new mongoose.Schema(
  {
    password: { type: String, required: true },
  },
);

module.exports = mongoose.model('AdminUser', AdminUserSchema);
