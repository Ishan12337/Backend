const mongoose = require("mongoose");
const accountModel = require("../models/account.model");

async function createAccountController(req, res) {
  try {
    const user = req.user;

    const existingAccount = await accountModel.findOne({ user: user._id });

    if (existingAccount) {
      return res.status(400).json({
        message: "User already has an account",
      });
    }

    const account = await accountModel.create({
      user: user._id,
    });

    return res.status(201).json({
      account: {
        id: account._id,
        user: account.user,
        status: account.status,
        currency: account.currency,
      },
      message: "Account created successfully",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function getUserAccountsController(req, res) {
  try {
    const user = req.user;

    const accounts = await accountModel.find({ user: user._id });

    return res.status(200).json({
      accounts,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function getAccountBalanceController(req, res) {
  try {
    const user = req.user;
    const { accountId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(accountId)) {
      return res.status(400).json({
        message: "Invalid account id",
      });
    }

    const account = await accountModel.findOne({
      _id: accountId,
      user: user._id,
    });

    if (!account) {
      return res.status(404).json({
        message: "Account not found",
      });
    }

    const balance = await account.getBalance();

    return res.status(200).json({
      accountId: account._id,
      balance,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

module.exports = {
  createAccountController,
  getUserAccountsController,
  getAccountBalanceController,
};





