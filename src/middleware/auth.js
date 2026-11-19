const { verifyToken } = require("../utils/auth");

function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const [type, token] = header.split(" ");

  if (type !== "Bearer" || !token) {
    return res.status(401).json({
      ok: false,
      message: "Login required. Missing or invalid token.",
    });
  }

  try {
    req.user = verifyToken(token);
    return next();
  } catch (_err) {
    return res.status(401).json({
      ok: false,
      message: "Session expired or invalid. Please log in again.",
    });
  }
}

module.exports = requireAuth;
