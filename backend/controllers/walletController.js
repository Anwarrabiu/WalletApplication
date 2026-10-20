const axios = require('axios');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const { response } = require('express');


//Fund Wallet Using Paystack
exports.fundWallet = async (req, res)=>{
    const {email, amount, userId} = req.body;
    try{
        //Create a pending transaction first
        const newTransaction = await Transaction.create({
            email,
            user: userId,
            amount,
            reference:`TXN_${Date.now()}`,
            status:'pending',
            type: 'credit',

        });
        //initialize payment with paystack after creating pending transaction
        const response = await axios.post(
            'https://api.paystack.co/transaction/initialize', 
            {
                email,
                amount: amount * 100,// Paystack expects amount in kobo
                reference: newTransaction.reference,
                callback_url:'http://localhost:3000/payment-success',
            },
            { 
              headers:{
                Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                'Content-Type': 'application/json',
                },
              }
            );
            res.status(200).json({
                status: true,
                message: 'Payment Initialized From Backend wallet Controller ',
                data: response.data.data,
                authorization_url:response.data.data.authorization_url,
            });
        }catch(error){
            res.status(500).json({ status: false, Error: error.message });
        }
    };

    //verify transaction (manual check)
    exports.verifyTransaction = async (req, res) =>{
       const {reference} = req.body;
        try {
            const response = await axios.get(
            `https://api.paystack.co/transaction/verify/${reference}`,
            {
                headers: {
                    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                },
            }
     );

     // const data =response.data.data;
     console.log(response);
     if(response.data.data.status === 'success'){ // to confirm if the transaction in paystack transactions is success
        //UPDATE USER WALLET TRANSACTION
        //get the particular transaction from this wallet that has this reference and populate user in the transaction retrieved
        const transaction = await Transaction.findOne({reference}).populate('user');
        console.log('transaction!!!!!!!!!!!!!!!!!!!');
       //console.log(transaction);

        if(transaction && transaction.status !== 'success'){
            transaction.status = 'success';
            await transaction.save();

            transaction.user.walletBalance += transaction.amount;
            await transaction.user.save();
        }
        return res.status(200).json({message:'Payment Verified Successfully', status:'completed'});
     }else{
         return res.json({message:'Payment Verification Failed, The Transaction is Not Successful!',status:'uncompleted'});
     }


    }catch (error) {
            res.status(500).json({errorr: error.message});
        }
    };

//Webhook - Automatically called by Paystack        //(Check for security vulnerability with this webhook)
exports.paystackWebhook = async (req, res)=>{
    try {
        const secret = process.env.PAYSTACK_SECRET_KEY;
        //validate signature
        const hash = crypto
        .createHmac('sha512', secret)//This line initializes an HMAC (Hash-based Message Authentication Code) object {}.
        .update(JSON.stringify(req.body))//This method updates the HMAC object with the data to be hashed.
        .digest('hex');//This method calculates the final HMAC hash and returns it.

        if(hash !== req.headers['x-paystack-signature']){
            return res.status(400).send('Invalid signature');
        }

        const event = req.body;

        //Handle successfull payment
        if(event.event === 'charge.success'){
            const reference = event.data.reference;
            const amount = event.data.amount/100;
            
            const transaction = await Transaction.findOne({reference}).populate('user');
            if(transaction && transaction.status !== 'success'){

                transaction.status = 'success';
                await transaction.save();

                transaction.user.walletBalance += amount;
                await transaction.user.save();
                console.log(`Wallet credited with: ₦ ${amount}`);
            }

        }
        res.sendStatus(200);
    } catch (error) {
        res.status(500).json({ error: error.message +'Webhook error'});
    }
};

//Get User Wallet Balance
exports.getWalletBalance =  async (req, res)=>{
    try{
        const user = await User.findById(req.params.userId);
        if(!user) return res.status(404).json({message: 'User not found'});
        res.json({ balance: user.walletBalance });

    }catch(err){
        res.status(500).json({error: err.message +'No User Found'});
    }
};

exports.getUserTransactions = async (req, res)=>{
    try {
        const transactions = await Transaction.find({ user: req.params.userId }).sort({createdAt: -1});
        if(!transactions) return res.status(404).json({ message:'Transactions not found' });
        

        res.json(transactions);
       //console.log(transactions);
        

    } catch (error) {
        res.status(500).json({message: error.message});
        console.log(error);
    }
};

//Transfer between accounts within this wallet
exports.transferFunds = async (req,res)=>{
    let {recipientEmail, amount, pin} = req.body;
    
    const sender = req.user;

    try {
        //basic validation
        amount = Number(amount);
        if(!recipientEmail || isNaN(amount) || !amount || amount <= 0){
            return res.status(400).json({message:'Invalid Transfer Details'});
        }
        if(pin.length !== 4){
            return res.status(400).json({message:'Pin must be 4 digits'});
        }
        //verify pin
        const isPinValid = await sender.checkWalletPin(pin);
        if(!isPinValid){
            return res.status(403).json({message:'Incorrect wallet pin'});
        }
        //check transaction limit
        const maxPerTx = parseInt(process.env.MAX_TRANSFER_PER_TRANSACTION);
        const maxDailyLimit = parseInt(process.env.MAX_DAILY_TRANSFER_LIMIT);
        if(amount > maxPerTx){
            return res.status(400).json({message:`You can't send more than ₦${maxPerTx.toLocaleString()} per transaction. `});
        }
        
        const receiver = await User.findOne({email:recipientEmail});

        if(!receiver){
            res.status(404).json({message:'Recipient not found'})
        } 
        if(receiver.email === sender.email ){
            return res.status(400).json({message: 'Can not transfer to self'})
        }
        if(sender.walletBalance < amount ){
            return res.status(400).json({message:'Insuffient balance'})
        }

        //Deduct from sender
        sender.walletBalance = sender.walletBalance - amount;
        await sender.save();

        //Credit receiver
        receiver.walletBalance = receiver.walletBalance + amount;
        await receiver.save();

        //Record both transactions
        await Transaction.create([
            {
                user:sender._id,
                email:sender.email,
                reference:`TXN_${Date.now()}snd`,// look into security vulnerability as diffrent nodes can create similar transaction at the same time 
                amount,
                type:'debit',
                description: `Transfer to ${recipientEmail}`,
                status:'success',
            },
            {
                user: receiver._id,
                email:receiver.email,
                reference:`TXN_${Date.now()}rcv`,
                amount,
                type: 'credit',
                description:`Received from ${sender.email}`,
                status:'success'
            }
        ]);

        res.json({message: `₦${amount} sent to ${recipientEmail} successfully!`})


    } catch (error) {
        console.error('Transfer Error:', error);
        res.status(500).json({message:'Transfer failed'})
    }
}

//Inter banks transfer 
exports.interBanksTransfer = async (req,res)=>{
    const {bankCode, accountNumber, amount, pin} = req.body;
    const sender = req.user;

    try {
        //validate required fields
        if(!bankCode || !accountNumber || !amount || !pin){
            return res.status(400).json({message:'All fields required'});
        }

        //verify pin
        const pinValid = await sender.comparePin(pin);
        if(!pinValid){
            return res.status(400).json({message:'Invalid pin'});
        }
        //Check wallet balance
        if(sender.walletBalance < amount){
            return res.status(400).json({message: 'Insufficient wallet balance'});
        }
        //verify account with paystack api
        const verifyResponse = await axios.get(
            `https://api.paystack.co/bank/resolve?account_number=${accountNumber}&bank_code=${bankCode}`,
        {
           headers:{ Authorization:`Bearer ${process.env.PAYSTACK_SECRET_KEY}`}
        });
        console.log(verifyResponse);
       

        if(!verifyResponse.status){
            return res.status(400).json({message:'Invalid bank details' });
        }
        const accountName = verifyResponse.data.account_name;

        //deduct wallet balance
        sender.walletBalance -= amount;
        await sender.save();

        //initialize transfer
        const transferResponse = await axios.post('https://api.paystack.co/transfer/',
            {
                source: 'balance',
                amount: amount * 100, //converts the amount to kobos
                recipient: {
                    type: 'nuban',
                    name: accountName,
                    accountNumber: accountNumber,
                    bank_code: bankCode,
                    currency: 'NGN',
                },
                reason: `Wallet withdrawal by ${sender.email}`,
            },
            {
                headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`}
            }
        );

        console.log(transferResponse);

        //Save transaction record
        await Transaction.create({
            user: sender._id,
            type: 'debit',
            amount,
            description: `Transfer to ${accountName} (${accountNumber})`,
            status: transferResponse.data.status ? 'success' : 'pending',
        });

        res.json(
            {
                message: `₦${amount} sent to ${accountName} successfully!`,
                data: transferResponse.data,
            });
    } catch (error) {
        console.error('Interbank Transfer Error:', error);
        res.status(500).json({message:'Transfer failed in backend', error: error });
        console.log(error);
    }
};

//Get banks
exports.getbanks = async (req,res)=>{
    try {
        const getbanksresponse = await axios.get(
            'https://api.paystack.co/bank',
            { headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`} },
        );
        res.json(getbanksresponse.data);
    } catch (error) {
        console.error('Bank list fetch error:', error.message);
        res.status(500).json({ message: 'Failed to fetch bank list' });
    }
};

//verify bank account
exports.verifyBankAccount = async (req, res)=>{
    const {bankCode, accountNumber} = req.body;
    const bankTestCode = '001';// Replace this with bankCode because now exceeds testing with bank real code in test mode

    try {
        if(!bankCode || !accountNumber){
            return res.status(400).json({message:'Bank code and bank number is required'});
        }
        const response = await axios.get(
            
            `https://api.paystack.co/bank/resolve?account_number=${accountNumber}&bank_code=${bankCode}`,
            {
                headers:{Authorization:`Bearer ${process.env.PAYSTACK_SECRET_KEY}`},
            }
            
        );
        if(!response.data.status){
            return res.status(400).json({message:'Invalid account details'});
        }
        res.json({ 
            accountName: response.data.data.account_name, 
            accountNumber: response.data.data.account_number, 
            bankCode, 
        });
    } catch (error){
        console.error('Account verification error:', error);
        res.status(500).json({message: 'Failed to verify account' });
    }
};

//set wallet pin
exports.setWalletPin =async(req,res)=>{
    const {pin} =req.body;
    const user = req.user;
    if(!pin || pin.length !== 4){
        return res.status(400).json({message:'Pin must be 4 digits'});
    }
    try {
        await user.setWalletPin(pin);
        await user.save();
        res.json({message:'Wallet pin set successfully!'});
    } catch (error) {
        console.error('Pin setup error:',error.message);
        res.status(500).json({message:'Failed to set pin'});
    }
};

//update existing pin
exports.updateWalletPin = async (req,res)=>{
    const {password, newPin} = req.body;
    const user = req.user;

   
    if(!newPin || !password){
        return res.status(400).json({message:'Password and new pin is required'});
    }
    if(newPin.length !==4){
        res.status(400).json({message:'New pin must be 4 digits'})
    }
    //fetched another user because the one stored in the req.user by protect middleware excludes password 
    // that we need here
    const fullUser = await User.findById({_id: user.id});
    const validPassword = await bcrypt.compare(password, fullUser.password);
    if(!validPassword){
        return res.status(401).json({message:'Invalid password'})
    }

    try {
        await user.setWalletPin(newPin);
        await user.save();
        res.json({message:'Wallet pin updated successfully'});
    } catch (error) {
        console.error('Pin update error:', error.message);
        res.status(500).json({message:'Failed to update pin'});
    }
};