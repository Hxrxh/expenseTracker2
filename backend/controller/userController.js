const userTable = require("../models/userModel");

const addUserSignupDetails = async (req, res) => {
  try {
    console.log(req.body);
    const { name, email, password } = req.body;
    console.log(name, email, password);
    const alreadyEmail = await userTable.findAll({
      where: {
        email: email,
      },
    });
    if (alreadyEmail) {
      res.status(500).send("User already exists");
    } else {
      const addedUserData = await userTable.create({
        name: name,
        email: email,
        password: password,
      });
      res.status(201).json(addedUserData);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ err: error.message });
  }
};
const handleLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userFound = await userTable.findOne({
      where: {
        email: email,
      },
    });
    console.log(userFound);

    if (!userFound) {
      return res.status(404).send("User not found.");
    } else {
      if (userFound.password !== password) {
        return res.status(401).send("Password Incorrect");
      } else {
        return res.status(200).send("User successfully logged in");
      }
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
};
module.exports = { addUserSignupDetails, handleLogin };
