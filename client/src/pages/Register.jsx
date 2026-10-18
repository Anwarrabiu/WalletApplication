import React, { useState } from 'react';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';


const Register = ()=>{
    const [user,setUser] = useState({
        name:'',
        email:'',
        password:''
    });
    const [msg, setMsg] = useState("");

    const navigate = useNavigate();

    const handleChange =(e)=>{
        setUser((prev)=> ({...prev, [e.target.name]:e.target.value }));
       
    }

    const handleRegister = async (e)=>{
        e.preventDefault();
        try{
        const registerResponse = await axios.post('http://localhost:8000/api/auth/register', user);
        console.log(registerResponse);
        
        if(registerResponse.statusText === 'Created'){
            setMsg("Registration Successful!");
            //localStorage is not secure
            localStorage.setItem('token', registerResponse.data.token);
            localStorage.setItem('user', JSON.stringify(registerResponse.data.user));
             navigate('/');
        }
        }catch(err){
            console.log("Error Registering !!!! :" +err);

        }
    }

    return(
        <div className='register'>
             <label>Name</label>
               <input type='text' name='name' placeholder='Enter Your Name' onChange={handleChange}/>
            <label>Email</label>
               <input type='email' name='email' placeholder='Enter Your Email' onChange={handleChange}/>
             <label>Password</label>
                <input type='password' name='password' placeholder='Enter Your Password' onChange={handleChange}/>

            <button onClick={handleRegister}> Sign Up </button>
            <button onClick={()=> navigate('/login')}> Sign In </button>
        </div>
    )
}

export default Register; 