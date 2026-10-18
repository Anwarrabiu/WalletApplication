import axios from "axios";
import React, { useState } from "react";

//verify transaction manually
const VerifyTransaction = ()=>{
    const [reference, setReference] = useState({});
    const token = localStorage.getItem('token');
    const [verifyMessage, setVerifyMessage] = useState("");
    const [color, setColor]=useState("");

    

    const handleChange =(e)=>{
        setReference((prev)=>({...prev, [e.target.name]:e.target.value}));
    }

    const handleVerify = async (e)=>{
        e.preventDefault();

        try{

        const verifyResponse = await axios.post('http://localhost:8000/api/wallet/verify', 
            reference,
        { 
            headers: {Authorization: `Bearer ${token}`},
        }
   
    );
        console.log('The verification response');
        console.log(verifyResponse)
        setVerifyMessage(verifyResponse.data.message);
        setColor(verifyResponse.data.status==='completed'? 'green':'tomato');
        console.log(verifyMessage);


        }catch(err){
            console.log(err + ':Failed to verify')
        }

    }

    return(
        <div>
            <h4 style={{color:"tomato"}}>Warning!!! This Verification Updates The Wallet Balance With The Amount Retrieved From Paystack </h4>
            <label>Enter the reference of transaction to verify</label>
            <input type="text" name="reference" onChange={handleChange} />
            <button type="submit" onClick={handleVerify}>Verify Transaction</button>
            <h3 style={ {color:color}}>{verifyMessage}</h3>
          
        </div>
    )
}

export default VerifyTransaction;