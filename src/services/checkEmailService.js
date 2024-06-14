const SeasonalUser = require('../models/SeasonalUser');

const checkEmail = async (email) => {
  const user = await SeasonalUser.findOne({ email });
  return { exists: !!user };
};

module.exports = checkEmail;
