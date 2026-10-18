const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.registerUser = async (req, res)=>{
    const {name, email, password} = req.body;
   

    try {
        //Check if user exists
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({message: 'User Already Exists'});
        }
        //Hash Password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);

        //Create user   
        const user = await User.create({name, email, password:hashedPassword });
     
        //Generate JWT
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '7d', });

        res.status(201).json({
            message:'User Registered Successfully',
            token,
            user:{id: user._id, name:user.name, email:user.email, balance:user.walletBalance },

        });

    } catch (error) {
        res.status(500).json({Errorrr: error.message});
    }
};


//Login
exports.loginUser = async (req, res) => {
    const {email, password} = req.body;

    try {
        const user = await User.findOne({email});
        if(!user)
            return res.status(400).json({message: 'Invalid Email or Password'});

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch)
            return res.status(400).json({message:'Invalid email or password'});

        const token = jwt.sign({ id: user._id, email:user.email}, process.env.JWT_SECRET, {expiresIn: '7d'});

        res.json({
            message: 'Login Successfull',
            token,
            user: {id: user._id, name: user.name, email:user.email },
        });
            
        
    } catch (error) {
        res.status(500).json({Error: error.message});
    }
};