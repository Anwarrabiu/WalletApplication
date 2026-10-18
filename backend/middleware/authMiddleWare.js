const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next)=>{
    let token;
    if(
        req.headers.authorization && 
        req.headers.authorization.startsWith('Bearer')
    ){
        try {
            //get token from header
            token = req.headers.authorization.split(' ')[1];

            //verify token 
            //This line verifies that a JWT is valid and was signed using your secret, 
            //and if it is, extracts the data stored inside it('user id and email' in this case because we sign the jwt with only id).
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            //console.log(decoded);
            //get user from db excluding password field
            req.user = await User.findById(decoded.id).select('-password');
            next();
        }catch(error){
            res.status(401).json({message:'Not Authorized, token failed'});
        }
    }
    if(!token){
        res.status(401).json({message:'No Token Provided'});
    }
};

