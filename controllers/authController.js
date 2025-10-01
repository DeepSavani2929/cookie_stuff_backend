const auth = require("../models/authSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


const registerUser = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    console.log(req.body)
    const isEmailExists = await auth.findOne({ email });
    if (isEmailExists) {
      return res
        .status(400)
        .json({
          success: false,
          message: "user with this email is already registered!",
        });
    }

    console.log(isEmailExists)

    const hasedPassword = await bcrypt.hash(password, 10);
    console.log(hasedPassword)

    await auth.create({
      fullName,
      email,
      password: hasedPassword,
    });

    return res
      .status(200)
      .json({ success: true, message: "User registered Successfully!" });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error!" });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const isUserExists = await auth.findOne({ email });

  if (!isUserExists) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid Credentials!" });
  }

  const isPasswordMatch = await bcrypt.compare(password, isUserExists.password);

  if (!isPasswordMatch) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid Credentials!" });
  }

  const token = jwt.sign(
    {
      id: isUserExists._id,
    },
    process.env.JWT_TOKEN,
    { expiresIn: "1d" }
  );

  // res
  //   .cookie("accessToken", token, {
  //     httpOnly: true,
  //     secure: true,
  //     sameSite: "lax",
  //     path: "/",
  //     maxAge: 24 * 60 * 60 * 1000,
  //   })
  //   .status(200)
  //   .json({ success: true, token, message: "User Login Successfully!" });

    
  res
    .status(200)
    .json({ success: true, token, message: "User Login Successfully!" });
};

module.exports = {
  registerUser,
  loginUser,
};
