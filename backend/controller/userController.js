const userTable = require("../models/userModel");

const addUserSignupDetails = async (req, res) => {
  try {
    console.log(req.body);
    const { name, email, password } = req.body;
    console.log(name, email, password);
    const addedUserData = await userTable.create({
      name: name,
      email: email,
      password: password,
    });
    res.status(201).json(addedUserData);
  } catch (error) {
    console.log(error);
    res.status(500).json({ err: error.message });
  }
};

module.exports = { addUserSignupDetails };
