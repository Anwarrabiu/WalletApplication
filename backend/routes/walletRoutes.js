const express = require('express');
const router = express.Router();
const {
    fundWallet, 
    getWalletBalance, 
    verifyTransaction, 
    paystackWebhook, 
    getUserTransactions, 
    transferFunds ,
    setWalletPin,
    updateWalletPin,
    interBanksTransfer,
    getbanks,
    verifyBankAccount
        } = require('../controllers/walletController');
const {protect} = require('../middleware/authMiddleWare');//a middleware to protect routes to allow only loggedin user

//Calling all the routes from client is an api call that requires this uri,body, and header with authorization(token) and content-type

//Fund wallet using paystack
router.post('/fund', protect, fundWallet);

//Verify wallet using paystack
router.post('/verify', protect, verifyTransaction);

//webhook that gets called by paystack after successfull payment by customers
router.post('/webhook', express.raw({type: 'application/json'}), paystackWebhook);

//Get wallet balance
router.get('/balance/:userId', protect, getWalletBalance);

//Get this user transactions
router.get('/transactions/:userId', protect, getUserTransactions);

//Transfer funds
router.post('/transfer', protect, transferFunds);

//Set Transaction Pin
router.post('/set-pin', protect, setWalletPin);

//Update Transaction Pin
router.post('/reset-pin', protect, updateWalletPin);

//Inter banks transfer
router.post('/interbanks-transfr', protect, interBanksTransfer);

//Get banks list
router.get('/banks', protect, getbanks);

//verify account
router.post('/verify-account', protect, verifyBankAccount);



module.exports = router;
