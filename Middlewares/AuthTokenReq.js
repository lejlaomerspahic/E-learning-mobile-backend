const jwt = require("jsonwebtoken");

const AuthTokenReq = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Unauthorized access." });
    }

    const decodedToken = jwt.verify(token, "yourSecretKey");
    req.userData = { userId: decodedToken.userId };
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: "Unauthorized access." });
  }
};

module.exports = AuthTokenReq;
