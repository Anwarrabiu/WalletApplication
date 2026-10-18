import React, {useState } from "react";
import reactDom from "react-dom";
import axios from 'axios';

const FundWallet = ()=>{
    const [amount, setAmount] = useState("");
    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');

    const handleFund = async ()=>{
        try {
            const fundRespond = await axios.post(
                'http://localhost:8000/api/wallet/fund',
                { email:user.email, amount, userId:user.id},
                { headers: {Authorization: `Bearer ${token}`}}
            );

            //Open Paystack checkout in a new tab
            window.open(fundRespond.data.data.authorization_url, "_blank");
            alert("Payment initialized. Complete payment in the new tab.");
            console.log('Payment Initialized');
          //onFunded();

        }catch(error){
            console.log(error);
            alert(error.response?.data?.error || "Error funding wallet!");
        }
    };
    
    return(
        <div>
            <h3>Fund Wallet</h3>
            <input type="number" placeholder="Enter amount" value={amount} onChange={(e)=> setAmount(e.target.value)} />
            <button onClick={handleFund}>Fund Now</button>
        </div>
    );

}

export default FundWallet;