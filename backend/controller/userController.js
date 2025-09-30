const userTable = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const addUserSignupDetails = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const alreadyEmail = await userTable.findOne({
      where: {
        email: email,
      },
    });
    if (alreadyEmail) {
      res.status(400).json({ message: "User already exists" });
    } else {
      bcrypt.hash(password, 10, async (err, hash) => {
        if (err) {
          console.log(err);
        }
        const addedUserData = await userTable.create({
          name: name,
          email: email,
          password: hash,
        });
        console.log(addedUserData);
        res.status(201).json({ message: "User signed up!" });
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const generateToken = (id) => {
  return jwt.sign({ userId: id }, "98cpe05ad32jil3cadffe42klax9321kdees0");
};
const handleLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userFound = await userTable.findOne({
      where: {
        email: email,
      },
    });

    if (!userFound) {
      return res.status(404).json({ message: "User not found." });
    } else {
      bcrypt.compare(password, userFound.password, (err, result) => {
        if (err) {
          res.status(500).json({ message: err.message });
        }
        if (result == true) {
          return res.status(200).json({
            message: "User Logged in Successfully",
            token: generateToken(userFound.id),
          });
        } else {
          res.status(401).json({ message: "Incorrect Password" });
        }
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};
module.exports = { addUserSignupDetails, handleLogin };
