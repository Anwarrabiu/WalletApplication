import React,{useState} from "react";
import axios from 'axios';

const UpdateTxPin = ()=>{
    const [password, setPassword] = useState('');
    const [newPin, setNewPin] = useState('');
    const [message, setMessage] = useState('');
    const token = localStorage.getItem('token');

    const handleUpdatePin = async (e)=>{
        e.preventDefault();
        try{
            const updateResponse = await axios.post('http://localhost:8000/api/wallet/reset-pin',
                {password, newPin},
                {
                    headers:{Authorization: `Bearer ${token}`}
                }
            );
            setMessage(updateResponse.data.message);
            setNewPin('');
        }catch(error){
            setMessage(error.response?.data?.message || 'Failed to set pin')

        }
    };

    return(
        <div>
            <h3>Update Wallet Pin</h3>
            <form onSubmit={handleUpdatePin}>
                <input 
                    type="password"
                    placeholder="Enter your login password"
                    value={password}
                    onChange={(e)=> setPassword(e.target.value)}
                    required
                />
                <input 
                    type="password"
                    placeholder="Enter a 4 digit pin"
                    value={newPin}
                    onChange={(e)=> setNewPin(e.target.value)}
                    required
                    maxLength={4}
                />
                <button type="submit"> Update Transaction PIN</button>
            </form>
        {message && <p>{message}</p>}
        </div>
    );
};

export default UpdateTxPin;