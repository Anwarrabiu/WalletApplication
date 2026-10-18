import React, {useState} from "react";
import axios from 'axios';

const Transfer = ()=>{
    const [recipientEmail, setRecipientEmail] = useState('');
    const [amount, setAmount]= useState(0);
    const [message, setMessage]= useState('');
    const [pin, setPin] = useState('');
    const token = localStorage.getItem('token');

    const handleTransfer = async (e)=>{
        e.preventDefault();

        try {
            const transferResponse = await axios.post('http://localhost:8000/api/wallet/transfer',
                {
                    recipientEmail, amount, pin
                },
                {
                    headers: {Authorization: `Bearer ${token}`}
                }
            );

            setMessage(transferResponse.data.message);
            setRecipientEmail('');
            setAmount(0);
            setPin('');
            
        } catch (error) {
            setMessage(error.response?.data?.message || 'Transfer failed. Try again later.');
        }
    };

     return(
        <div>
            <h2>Transfer Funds</h2>
            <form onSubmit={handleTransfer}>
                <input 
                    type="email" 
                    placeholder="Recipient Email" 
                    value={recipientEmail} 
                    onChange={(e)=> setRecipientEmail(e.target.value)} 
                    required
                />
                <input 
                    type="number" 
                    placeholder="Amount" 
                    value={amount} 
                    onChange={(e)=> setAmount(e.target.value)} 
                    required
                />
                <input
                    type="password"
                    placeholder="Enter 4 digit PIN"
                    value={pin}
                    onChange={(e)=> setPin(e.target.value)}
                    required
                    maxLength='4'
                />
                <button type="submit">Send</button>
            </form>
            { message && <p>{message}</p> }
        </div>
     );
};

export default Transfer;


