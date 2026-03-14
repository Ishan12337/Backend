const transactionModel = require("../models/transaction.model")
const ledgerModel = require("../models/ledger.model")
const accountModel = require("../models/account.model")
const emailService = require("../services/email.service")
const mongoose = require("mongoose")

/*
 USER → USER TRANSACTION
*/

async function createTransaction(req, res) {

try {

const { fromAccount, toAccount, amount, idempotencyKey } = req.body

if(!fromAccount || !toAccount || !amount || !idempotencyKey){
 return res.status(400).json({
  message:"fromAccount, toAccount, amount and idempotencyKey required"
 })
}

if(!mongoose.Types.ObjectId.isValid(fromAccount) || !mongoose.Types.ObjectId.isValid(toAccount)){
 return res.status(400).json({message:"Invalid account id"})
}

if(String(fromAccount) === String(toAccount)){
 return res.status(400).json({message:"Cannot transfer to same account"})
}

const parsedAmount = Number(amount)

if(isNaN(parsedAmount) || parsedAmount <= 0){
 return res.status(400).json({message:"Invalid amount"})
}

const existingTransaction = await transactionModel.findOne({ idempotencyKey })

if(existingTransaction){
 return res.status(200).json({
  message:"Transaction already processed",
  transaction:existingTransaction
 })
}

const fromUserAccount = await accountModel.findOne({
 _id:fromAccount,
 user:req.user._id
})

const toUserAccount = await accountModel.findById(toAccount)

if(!fromUserAccount || !toUserAccount){
 return res.status(404).json({message:"Account not found"})
}

if(fromUserAccount.status !== "ACTIVE" || toUserAccount.status !== "ACTIVE"){
 return res.status(400).json({message:"Accounts must be ACTIVE"})
}

const balance = await fromUserAccount.getBalance()

if(balance < parsedAmount){
 return res.status(400).json({message:"Insufficient funds"})
}

const session = await mongoose.startSession()

try{

session.startTransaction()

const txArr = await transactionModel.create([{
 fromAccount,
 toAccount,
 amount:parsedAmount,
 idempotencyKey,
 status:"PENDING"
}],{session})

const tx = txArr[0]

await ledgerModel.create([
 {
  account:fromAccount,
  amount:parsedAmount,
  type:"DEBIT",
  transaction:tx._id
 },
 {
  account:toAccount,
  amount:parsedAmount,
  type:"CREDIT",
  transaction:tx._id
 }
],{session})

tx.status = "COMPLETED"
await tx.save({session})

await session.commitTransaction()

emailService.sendTransactionEmail(
 req.user.email,
 req.user.name,
 parsedAmount,
 toUserAccount._id
).catch(err => console.error("Email error:",err))

return res.status(201).json({
 message:"Transaction successful",
 transaction:tx
})

}catch(err){
 await session.abortTransaction()
 throw err
}
finally{
 session.endSession()
}

}catch(error){
 return res.status(500).json({message:error.message})
}

}

/*
 SYSTEM → USER TRANSACTION
*/

async function createInitialFundsTransaction(req, res){

try{

const {toAccount, amount, idempotencyKey} = req.body

if(!toAccount || !amount || !idempotencyKey){
 return res.status(400).json({
  message:"toAccount, amount and idempotencyKey required"
 })
}

if(!mongoose.Types.ObjectId.isValid(toAccount)){
 return res.status(400).json({message:"Invalid account id"})
}

const parsedAmount = Number(amount)

if(isNaN(parsedAmount) || parsedAmount <= 0){
 return res.status(400).json({message:"Invalid amount"})
}

const existingTransaction = await transactionModel.findOne({idempotencyKey})

if(existingTransaction){
 return res.status(200).json({
  message:"Transaction already processed",
  transaction:existingTransaction
 })
}

const toUserAccount = await accountModel.findById(toAccount)

if(!toUserAccount){
 return res.status(404).json({message:"Account not found"})
}

const fromSystemAccount = await accountModel.findOne({systemAccount:true})

if(!fromSystemAccount){
 return res.status(404).json({message:"System account not found"})
}

const session = await mongoose.startSession()

try{

session.startTransaction()

const txArr = await transactionModel.create([{
 fromAccount:fromSystemAccount._id,
 toAccount:toUserAccount._id,
 amount:parsedAmount,
 idempotencyKey,
 status:"PENDING"
}],{session})

const tx = txArr[0]

await ledgerModel.insertMany([
 {
  account:fromSystemAccount._id,
  amount:-parsedAmount,
  type:"DEBIT",
  transaction:tx._id
 },
 {
  account:toUserAccount._id,
  amount:parsedAmount,
  type:"CREDIT",
  transaction:tx._id
 }
],{session})


tx.status = "COMPLETED"
await tx.save({session})

await session.commitTransaction()

return res.status(201).json({
 message:"Initial funds added",
 transaction:tx
})

}catch(err){
 await session.abortTransaction()
 throw err
}
finally{
 session.endSession()
}

}catch(error){
 return res.status(500).json({message:error.message})
}

}

module.exports = {
 createTransaction,
 createInitialFundsTransaction
}