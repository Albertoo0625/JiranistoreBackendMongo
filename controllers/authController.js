const User = require('../modal/UserSchema');
const bcrypt = require('bcrypt');
require("dotenv").config();
const jwt = require('jsonwebtoken');

const handleLogin = async (req, res) => {
  const { user, pwd } = req.body;

  console.log(user, pwd);

  if (!user || !pwd) return res.status(400).json({ "message": "Username and password are required" });

  try {
    const foundUser = await User.findOne({ user_username: user });
    
    if (!foundUser) return res.status(401).json({ "message": "Unauthorized" });
    
    const match = await bcrypt.compare(pwd, foundUser.user_password);
    
    if (match) {
      const roles = foundUser.user_roles;

      const accessToken = jwt.sign(
        {
          "UserInfo": {
            "username": foundUser.user_username,
            "roles": roles
          }
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '1d' }
      );

      const refreshToken = jwt.sign(
        { "username": foundUser.user_username },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "1d" }
      );

      foundUser.user_refreshToken = refreshToken;
      await foundUser.save();

      res.cookie("jwt", refreshToken, { httpOnly: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 });
      res.json({ accessToken, roles });
    } else {
      res.status(401).json({ "message": "Unauthorized" });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ "message": "Internal Server Error" });
  }
}

const getUsersDetails = async (req, res) => {
  const cookies = req.cookies;

  if (!cookies?.jwt) return res.status(401).json("Cookies not found");

  const refreshToken = cookies.jwt;

  try {
    const userDetails = await User.findOne({ user_refreshToken: refreshToken });
    res.status(200).json(userDetails);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ "message": "Internal Server Error" });
  }
}

module.exports = { handleLogin, getUsersDetails };
