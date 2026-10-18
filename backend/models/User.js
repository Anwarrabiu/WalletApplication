const  mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, unique: true, required: true},
    password:{type: String, required: true},
    walletPin: {type: String},
    walletBalance: {type: Number, default: 0},
},
{timestamps: true}
);

userSchema.methods.setWalletPin = async function(pin){
    const salt = await bcrypt.genSalt(10);
    this.walletPin = await bcrypt.hash(pin,salt);
};

userSchema.methods.checkWalletPin = async function(pin){
    return await bcrypt.compare(pin, this.walletPin);
}

userSchema.methods.comparePin = async function(pin){
    if(!this.walletPin) return false;
    return bcrypt.compare(pin, this.walletPin);
};

module.exports = mongoose.model('User', userSchema);