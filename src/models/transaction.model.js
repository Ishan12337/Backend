const mongoose = require("mongoose")

const transactionSchema = new mongoose.Schema({

fromAccount: {
 type: mongoose.Schema.Types.ObjectId,
 ref: "Account",
 required: [true, "Source account is required"],
 index: true
},

toAccount: {
 type: mongoose.Schema.Types.ObjectId,
 ref: "Account",
 required: [true, "Destination account is required"],
 index: true
},

status: {
 type: String,
 enum: {
  values: ["PENDING","COMPLETED","FAILED","REVERSED"],
  message: "Transaction status must be PENDING, COMPLETED, FAILED or REVERSED"
 },
 default: "PENDING"
},

amount: {
 type: Number,
 required: [true, "Transaction amount is required"],
 min: [0.01, "Transaction amount must be at least 0.01"]
},

idempotencyKey: {
 type: String,
 required: [true, "Idempotency key is required"],
 unique: true,
 index: true
},
type:{
 type:String,
 enum:["TRANSFER","DEPOSIT","WITHDRAWAL"],
 default:"TRANSFER"
}

},{
timestamps:true
})

const transactionModel = mongoose.model("Transaction", transactionSchema)

module.exports = transactionModel
