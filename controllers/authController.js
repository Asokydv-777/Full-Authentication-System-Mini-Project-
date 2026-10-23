const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const signup = async (req, res) => {
  try {
    const { email, password } = req.body;

    
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required." });
    }

    
    if (User.findByEmail(email)) {
      return res.status(409).json({ message: "User already exists." });
    }

  
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    
    const newUser = {
      id: Date.now().toString(), 
      email,
      password: hashedPassword,
      role: "user", 
    };

    
    User.create(newUser);

    res.status(201).json({
      message: "User created successfully.",
      user: { id: newUser.id, email: newUser.email, role: newUser.role },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error during signup." });
  }
};



const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    
    const user = User.findByEmail(email);

   
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

  
    const accessToken = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }, 
    );

    const refreshToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" }, 
    );



    res.json({
      message: "Login successful",
      accessToken,
      refreshToken,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error during login." });
  }
};



const refreshTokenHandler = (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh token is required." });
  }

  try {
    
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

   
    const user = User.findById(decoded.userId);
    if (!user) {
      return res.status(403).json({ message: "User not found." });
    }

   
    const newAccessToken = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "15m" },
    );

    

    res.json({ accessToken: newAccessToken });
  } catch (error) {
    return res
      .status(403)
      .json({ message: "Invalid or expired refresh token." });
  }
};




const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;
    const user = User.findByEmail(email);

    if (!user) {
      return res.json({
        message: "If that email is registered, a reset link has been sent.",
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = Date.now() + 5000; // 5 seconds

    user.resetToken = resetToken;
    user.resetTokenExpiry = resetTokenExpiry;

    console.log(`Password reset token for ${email}: ${resetToken}`);

    res.json({
      message: "If that email is registered, a reset link has been sent.",

      resetToken: resetToken,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
};

const completePasswordReset = async (req, res) => {
  try {
    const { resetToken, newPassword } = req.body;

    if (!resetToken || !newPassword) {
      return res
        .status(400)
        .json({ message: "Reset token and new password are required." });
    }

    
    const user = User.getAll().find((u) => u.resetToken === resetToken);

    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid or expired reset token." });
    }

   
    if (Date.now() > user.resetTokenExpiry) {
      return res.status(400).json({ message: "Reset token has expired." });
    }

    
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    
    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;

    res.json({ message: "Password has been reset successfully." });
  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
};

module.exports = {
  signup,
  login,
  refreshToken: refreshTokenHandler,
  requestPasswordReset,
  completePasswordReset,
};


module.exports = {
  signup,
  login,
  refreshToken: refreshTokenHandler,
  requestPasswordReset,
  completePasswordReset,
};





