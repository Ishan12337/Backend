const mongoose = require("mongoose")

const ledgerSchema = new mongoose.Schema({
    account: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Account",
        required: [true, "Ledger must be associated with an account and account must be specified"],
        index: true,
        immutable: true
    },
    amount:{
        type: Number,
        required: [true, "Amount is required for creating a ledger entry"],
        immutable: true
    },

    transaction: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Transaction",
        required: [true, "Ledger entry must be associated with a transaction and transaction must be specified"],
        index: true,
        immutable: true
    },

    type: {
        type: String,
        enum: {
            values: ["DEBIT", "CREDIT"],
            message: "Type can be either 'DEBIT' or 'CREDIT'",
        },
        required: [true, "Ledger type is required"],
        immutable: true
    }
})


function preventLedgerModificdation(){
    throw new Error("Ledger entries are immutable and cannot be modified or deleted once created")
}

ledgerSchema.pre("findOneAndUpdate", preventLedgerModificdation)
ledgerSchema.pre("updateOne", preventLedgerModificdation)
ledgerSchema.pre("deleteOne", preventLedgerModificdation)
ledgerSchema.pre("findOneAndDelete", preventLedgerModificdation)
ledgerSchema.pre("remove", preventLedgerModificdation)
ledgerSchema.pre("findOneAndRemove", preventLedgerModificdation)
ledgerSchema.pre("updateMany", preventLedgerModificdation)
ledgerSchema.pre("findOneAndReplace", preventLedgerModificdation)


const ledgerModel = mongoose.model("Ledger", ledgerSchema)

module.exports = ledgerModel

