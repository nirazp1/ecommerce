const User = require('../models/User');
const Supplier = require('../models/Supplier');

exports.registerBusiness = async (req, res) => {
  try {
    const { companyName, storeName, address, phoneNumber, description, storePhotos, productCategories } = req.body;
    const userId = req.user.userId; // Assuming you have middleware to extract user info from token

    // Update user profile with business details
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          'profile.companyName': companyName,
          'profile.storeName': storeName,
          'profile.address': address,
          'profile.phoneNumber': phoneNumber,
          'profile.description': description,
          'profile.storePhotos': storePhotos,
          'profile.productCategories': productCategories
        }
      },
      { new: true }
    );

    // Create a new supplier entry
    const newSupplier = new Supplier({
      user: userId,
      companyName,
      storeName,
      address,
      phoneNumber,
      description,
      storePhotos,
      productCategories
    });
    await newSupplier.save();

    res.status(201).json({ message: 'Business registered successfully', user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: 'Error registering business', error: error.message });
  }
};
