import { useState } from 'react';
import axios from 'axios';
import {data, useNavigate} from 'react-router-dom';

const Login = ()=>{
    const [user, setUser] = useState({
        email:" ",
        password:" "
    }); 
    const [msg, setMsg] = useState("");

    const navigate = useNavigate();
 
    const handleChange = (e) => {
        setUser((prev)=> ({...prev, [e.target.name]:e.target.value }));
        //console.log(e.target.value);
    }

    const handleLogin = async (e)=>{
        e.preventDefault();

        try{
        const loginResponse = await axios.post('http://localhost:8000/api/auth/login', user);
        console.log("Login Successfull!");
        console.log(loginResponse);

        if(loginResponse.statusText === 'OK'){
            setMsg("Successfully Loggedin");
            //using localStorage is not secure
            localStorage.setItem('token', loginResponse.data.token );
            localStorage.setItem('user', JSON.stringify(loginResponse.data.user) );
            console.log(localStorage.getItem('user'));
            navigate('/');

        }

        }catch(err){
            console.log(err);
        }
    }
    return (
        <div className='login'>
            <label>Email</label>
            <input type='email' name='email' placeholder='Enter Your Email' onChange={handleChange}/>

             <label>Password</label>
            <input type='password' name='password' placeholder='Enter Your Password' onChange={handleChange}/>

            <button onClick={handleLogin}> Sign In </button>
            <button onClick={()=>  navigate('/sign-up')}> Sign up </button>
        </div>
    )
}

export default Login;