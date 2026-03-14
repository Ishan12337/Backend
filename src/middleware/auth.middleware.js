const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");

const authMiddleware = async (req, res, next) => {
 try {

  let token = req.cookies.token;

  if (!token && req.headers.authorization) {
   const parts = req.headers.authorization.split(" ");
   if (parts[0] === "Bearer" && parts[1]) {
    token = parts[1];
   }
  }

  if (!token) {
   return res.status(401).json({
    message: "Authentication token missing"
   });
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  const user = await userModel
   .findById(decoded.userId)
   .select("-password");

  if (!user) {
   return res.status(401).json({
    message: "User no longer exists"
   });
  }

  req.user = user;

  next();

 } catch (err) {
  return res.status(401).json({
   message: "Invalid or expired token"
  });
 }
};


const authSystemUserMiddleware = (req, res, next) => {

 if (!req.user) {
  return res.status(401).json({
   message: "Authentication required"
  });
 }

 
 next();
};

module.exports = {
 authMiddleware,
 authSystemUserMiddleware
};







