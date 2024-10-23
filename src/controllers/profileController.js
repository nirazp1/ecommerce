const User = require('../models/User');

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ message: 'Error fetching profile' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user.userId,
      { $set: { profile: req.body } },
      { new: true, runValidators: true }
    ).select('-password');
    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(400).json({ message: 'Error updating profile', error: error.message });
  }
};

exports.submitKYC = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    user.kycVerified = true;
    await user.save();
    res.json({ message: 'KYC submitted successfully' });
  } catch (error) {
    console.error('Error submitting KYC:', error);
    res.status(400).json({ message: 'Error submitting KYC', error: error.message });
  }
};
