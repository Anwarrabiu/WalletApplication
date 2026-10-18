const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const { verify } = require('crypto');

dotenv.config();
connectDB();

const app = express();

//Middlewares
//app.use(express.json());
app.use(express.json({
    //verify function allows you to inspect the raw request body before it's parsed as JSON.
    verify: (req,res,buf)=>{ //buf: A Buffer containing the raw request body.
        if(req.originalUrl.startsWith('/api/wallet/webhook')){
            req.rawBody = buf.toString();//takes the raw request body (which is in buf) and converts it to a string
        }
    }
}));
app.use(cors());

//Routes
app.get('/',(req,res)=> res.send('You hit my server backend base'))
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/wallet', require('./routes/walletRoutes'));




const PORT = process.env.PORT || 8000;
app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
});