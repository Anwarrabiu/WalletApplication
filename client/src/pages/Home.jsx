import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import Dashboard from "./Dashboard";

const Home = ()=>{

    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState({});
    
   
    useEffect(()=>{
      
        setCurrentUser(JSON.parse(localStorage.getItem('user')));
       
    }, []);

     
  const handleLogout =()=>{
    localStorage.clear();
    navigate('/login');
   console.log('Logged out successfully')
  };

    return(
        <div>
            <h2> Welcome, {currentUser ? currentUser.name : 'User'}</h2>
            
             { 
             //Checking if the user is logged in then we can display user dashboard
             currentUser ? < Dashboard logout={handleLogout}/> :
           
           <div>
                <button onClick={()=> navigate('/login')} >Sign-In</button>
                <button onClick={()=> navigate('/sign-up')} >Sign Up</button>
           </div>
            }

        </div>
    )
}

export default Home;