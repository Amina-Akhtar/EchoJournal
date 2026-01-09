const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require('../models/userModel');
const axios = require("axios");
const oauth2Client = require("../oauth2client"); 

exports.signin = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" })
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid username or password" });
    }
    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );
    return res
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "lax",
      })
      .header("Authorization", `Bearer ${token}`)
      .status(201)
      .send({
        success: true, message: "Signin Successfull!"
      });
  }
  catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.signup = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "User already exists" });
    }
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      authProvider: 'local'
    });

    await newUser.save();

    const token = jwt.sign(
      { id: newUser._id, username: newUser.username },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    return res
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "lax",
      })
      .header("Authorization", `Bearer ${token}`)
      .status(201)
      .send({
        success: true, message: "Signup Successfull!"
      });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.signout = async (req, res) => {
  res.clearCookie("token", {
  });
  res.status(200).send({ success: true, message: "Signout successfull" });
};

exports.googleAuth = async (req, res) => {
  try {
    const { code } = req.body;

    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    const googleUser = await axios.get(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: {
          Authorization: `Bearer ${tokens.access_token}`
        }
      }
    );
    const { email, name, picture } = googleUser.data;
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        username: name,
        email,
        authProvider: "google",
      });
    }
    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );
     return res
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "lax"
      })
      .header("Authorization", `Bearer ${token}`)
      .status(200)
      .send({
        success: true, message: "Google Auth successful!",user:{username: user.username, password: ''}
      });
    }
   catch (err) {
    console.error(err);
    res.status(500).json({ message: "Google Auth failed!" });
  }
};
