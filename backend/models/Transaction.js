const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
        user: {type: mongoose.Schema.Types.ObjectId, ref:'User', required:true},
        email:{type:String, required:true},
        amount: {type: Number, required: true},
        reference: {type: String, required: true, unique: true},
        status: {type: String,enum:['pending','success','failed'], default: 'pending'}, // pending, success, failed
        type:{type:String, enum:['credit','debit'], default:''}


    },
    {timestamps:true}
);

module.exports = mongoose.model('Transaction', transactionSchema);