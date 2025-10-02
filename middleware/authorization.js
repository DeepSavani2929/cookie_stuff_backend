const jwt = require("jsonwebtoken");

const authorization = (req, res, next) => {
  let token =
    req.cookies?.accessToken ||
    req.get("Authorization") ||
    req.headers["authorization"];
  console.log(token);

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Authorization header is missing!" });
  }

  console.log(token);

  if (token && token.startsWith("Bearer")) {
    token = token.split(" ")[1];
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_TOKEN);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = authorization;
