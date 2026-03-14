const { Router } = require("express");
const authController = require("../controllers/auth.controller");

const authRouter = Router();

/**
 * POST /api/auth/register
 * Register new user
 */
authRouter.post("/register", authController.userRegisterController);

/**
 * POST /api/auth/login
 * Login user
 */
authRouter.post("/login", authController.userLoginController);

/**
 * POST /api/auth/logout
 * Logout user
 */
authRouter.post("/logout", authController.logoutUserController);


module.exports = authRouter;
