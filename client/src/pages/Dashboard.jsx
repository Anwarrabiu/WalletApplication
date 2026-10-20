import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';



const Dashboard = (props)=>{

    const navigate = useNavigate();

    const [balance, setBalance]=useState(0);
    const [transactions,setTransactions] = useState([]);
    const [currentUser, setCurrentUser] = useState({});
    const token = localStorage.getItem('token');

    
    //Wrap fetchBalance in useCallback
    const fetchBalance = useCallback(async () => {
        if (!currentUser?.id) return; // Prevent call if user ID isn't loaded yet
        try {
            const balanceResponse = await axios.get(`http://localhost:8000/api/wallet/balance/${currentUser.id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setBalance(balanceResponse.data.balance);
        } catch (error) {
            console.log(error + ':Error fetching balance');
        }
    }, [currentUser?.id, token]); // Only recreates if ID or token changes
    
        //  Wrap fetchTransactions in useCallback
    const fetchTransactions = useCallback(async () => {
        if (!currentUser?.id) return;
        try {
            const transactionsResponse = await axios.get(`http://localhost:8000/api/wallet/transactions/${currentUser.id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTransactions(transactionsResponse.data);
        } catch (error) {
            console.log(error);
        }
    }, [currentUser?.id, token]);

  useEffect(()=>{
        fetchBalance();
        fetchTransactions();
        setCurrentUser(JSON.parse(localStorage.getItem('user')));
       
    }, [fetchBalance, fetchTransactions]);
    return(
        <div>

            <p><b>Wallet Balance: </b>₦ {balance}</p><br></br>
           
            <button onClick={()=>navigate('/FundWallet')}>Fund Wallet</button>
            <button onClick={()=>navigate('/Transfer')}>Transfer to Wallet</button>
            <button onClick={()=>navigate('/Interbanks-Transfer')}>Inter Banks Transfer</button>

 
            <h2>Transaction History</h2>
            <table border='1' cellPadding='6'> 
                <thead>
                    <tr>
                        <th>Amount (₦)</th>
                        <th>Status</th>
                        <th>Reference</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>{transactions.map((transaction)=>(
                    <tr key={transaction._id}>
                        <td>{transaction.amount}</td>
                        <td>{transaction.status}</td>
                        <td>{transaction.reference}</td>
                        <td>{new Date(transaction.createdAt).toLocaleString()}</td>
                    </tr>
                ))}</tbody>
            </table>

             <button onClick={()=>props.logout()} >Logout</button><br></br>
             
            </div>
    )
}

export default Dashboard;