const jwt = require("jsonwebtoken");
const usersDB = require('../database/controllers/users');

exports.authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) { return res.sendStatus(403) }
      req.user = user;
      next();
  })
}

exports.loginMatch = async (req, res, next) => {
  user = await usersDB.getUserByEmail(req.body.email);
  if (!user.success) { return res.status(400).json({ "success": false, "error": "Invalid email or password"}); }
  if (await bcrypt.compare(password, user.password)){
    req.user = {
      id: user.id,
      email: user.email,
      permissionLevel: user.permissionLevel,
      provider: 'email',
      firstName: user.firstName,
      lastName: user.lastName
    };
    return next();
  } else {
    return res.status(400).json({ "success": false, "error": "Invalid email or password"});
  }
}