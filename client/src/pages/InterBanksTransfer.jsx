import React, {useEffect, useState} from "react";
import axios from 'axios';

const InterBanksTransfer = ()=>{
    const [banks, setBanks] = useState([])
    const [bankCode, setBankCode] = useState('');
    const [accountNumber, setAccountNumber] = useState('');
    const [accountName, setAccountName] = useState('');
    const [amount, setAmount] = useState('');
    const [pin, setPin] = useState('');
    const [message, setMessage] = useState('');
    const token = localStorage.getItem('token');
    const [loading, setLoading] = useState(false);

    useEffect(()=>{
        const fetchBanks = async ()=>{
            try {
                const fetchBanksResponse = await axios.get('http://localhost:8000/api/wallet/banks',
                    {
                        headers: { Authorization: `Bearer ${token}`},
                    }
                );
                setBanks(fetchBanksResponse.data.data);
                //console.log(fetchBanksResponse.data.data);
               
            } catch (error) {
                console.error('Failed to load banks:', error);
            }
        };
        fetchBanks();
    }, [token]);
    //console.log(banks);

    useEffect(()=>{
        const verifyAccount = async ()=>{
            if(accountNumber.length === 10 && bankCode){
                setLoading(true);
                try {
                    const response = await axios.post(
                        'http://localhost:8000/api/wallet/verify-account',
                        {
                            bankCode, accountNumber
                        },
                        {
                            headers: {Authorization: `Bearer ${token}`}
                        }
                    ); 
                    setAccountName(response.data.accountName);
                    setLoading(false);
                    console.log(response.data.accountName);
                } catch (error) {
                    setAccountName('');
                    console.error('Verification failed:',error);
                }
            }else{
                setAccountName('')
            }
        };
        verifyAccount();
    }, [accountNumber, bankCode, token]);



    const handleTransfer = async (e)=>{
        e.preventDefault();
        try {
            const transferResponse = await axios.post('http://localhost:8000/api/wallet/interbanks-transfer',
                {
                    bankCode, accountNumber, amount, pin
                },
                {
                    headers: { Authorization: `Bearer ${token}`}
                }
            );

            console.log(transferResponse);

            setMessage(transferResponse.data.message);
            setBankCode('');
            setAccountNumber('');
            setAccountName('');
            setAmount('');
            setPin('');
            
        } catch (error) {
            setMessage(error.response?.data?.message || 'Transfer failed in client');
            console.log(error);
        }
    };

    return(
        <div>
            <h3>Interbank Transfer</h3>
            <form onSubmit={handleTransfer}>
                <select 
                    value={bankCode}
                    onChange={(e)=> setBankCode(e.target.value)} 
                    required>
                    <option value="">Select Bank</option>
                    { banks.map((bank)=> (
                        <option key={bank.code} value={bank.code}> 
                             {bank.name}
                        </option>
                    ))} 

                </select>
                <input 
                    type="text" 
                    placeholder="Account Number" 
                    value={accountNumber} 
                    onChange={(e)=> setAccountNumber(e.target.value)}
                    required
                    maxLength={10}
                />
                {/*show verified account name*/}
                {
                    loading && <p> Verifying Account... </p> 
                }
                {
                    accountName && <p style={{color:'green'}}> {accountName} </p> 
                }
               

                <input 
                    type="number" 
                    placeholder="Amount " 
                    value={amount} 
                    onChange={(e)=> setAmount(e.target.value)}
                    required
                />
                <input 
                    type="password"
                    placeholder="Enter 4-digit PIN"
                    value={pin}
                    onChange={(e)=> setPin(e.target.value)}
                    required
                    maxLength={4}
                />
                <button type="submit" disabled={!accountName}>Send</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default InterBanksTransfer;
