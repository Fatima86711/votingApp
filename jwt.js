const jwt = require("jsonwebtoken");

const jwtSecret = process.env.JWT_SECRET || "your_super_secret_key_for_testing";
const jwtAuthMiddleware = (request, response, next) => {
  const authHeader = request.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return response
      .status(401)
      .json({ error: "Authorization header missing or invalid" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, jwtSecret);
    request.user = decoded;
    next();
  } catch (err) {
    console.error("JWT verification failed:", err.message);
    response.status(401).json({ error: "Unauthorized" });
  }
};
const generateToken = (userData) => {
  return jwt.sign(userData, jwtSecret);
};

module.exports = { jwtAuthMiddleware, generateToken };
