import React, {useState} from "react";
import axios from 'axios';

const SetPin = ()=>{
    const [pin, setPin]= useState('');
    const [message, setMessage] = useState('');
    const token = localStorage.getItem('token');

    const handleSetPin = async(e)=>{
        e.preventDefault();

        try {
            const setPinResponse = await axios.post('http://localhost:8000/api/wallet/set-pin',
                {pin},
                {headers: {Authorization: `Bearer ${token}`}}
            );
            setMessage(setPinResponse.data.message);
            setPin('');
        } catch (error) {
            setMessage(error.response?.data?.message || 'Error setting PIN');
        }
    };

    return(
        <div>
            <h3>Set Wallet PIN</h3>
            <form onSubmit={handleSetPin}>
                <input
                    type="password"
                    placeholder="Enter 4 digit PIN"
                    value={pin}
                    onChange={(e)=>setPin(e.target.value)}
                    required
                    maxLength='4'               
                />
                <button type="submit">Set PIN</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default SetPin;