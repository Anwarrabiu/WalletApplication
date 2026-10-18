import React, {useState} from 'react';
//import reactDom from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import Register from './pages/Register';
import FundWallet from './pages/FundWallet';

function App() {
  const [page, setPage]=useState(localStorage.getItem('token')? 'home':'login');
  
  const handleLogout =()=>{
    localStorage.clear();
    setPage('login');
  };

  return (
    <div className="App" style={{ padding:20 }} >
      { page === 'login' && (
        <>
        <Login onLoggedIn={ ()=> setPage('home') } />
        <p>
          Don't have an account? {" "}
          <button onClick={()=> setPage('register')}>Sign Up</button>
        </p>
        </>
      )}

      { page === 'register' && (
        <>
        <Register onRegistered={ ()=> setPage('home') } />
        <p>
          Already have an account? {" "}
          <button onClick={()=> setPage('login')}>Sign In</button>
        </p>
        </>
      )}

      {page === 'home' && <Home onLogout={handleLogout} />}

    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />}/>
        <Route path='/login' element={<Login />} />
        <Route path='/sign-up' element={<Register/>} />
        <Route path='/fundwallet' element={<FundWallet/>} />
      </Routes>
    </BrowserRouter>
    
    </div>
  );
}

export default App;
