const { Router } = require("express");
const { authMiddleware, authSystemUserMiddleware } = require("../middleware/auth.middleware");
const transactionController = require("../controllers/transaction.controller");

const transactionRouter = Router();

/**
 * POST /api/transactions
 * Create a new transaction
 */
transactionRouter.post(
 "/",
 authMiddleware,
 transactionController.createTransaction
);

/**
 * POST /api/transactions/system/initial-funds
 * Only system user can create initial funds
 */
transactionRouter.post(
 "/system/initial-funds",
 authMiddleware,
 authSystemUserMiddleware,
 transactionController.createInitialFundsTransaction
);

module.exports = transactionRouter;
 