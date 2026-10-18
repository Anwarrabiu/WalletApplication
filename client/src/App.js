//import React, {useState} from 'react';
//import reactDom from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import Register from './pages/Register';
import FundWallet from './pages/FundWallet';
import VerifyTransaction from './pages/VerifyTransaction';
import PaymentSuccess from './pages/PaymentSuccess';
import Transfer from './pages/Transfer';
import SetPin from './pages/SetPin';
import UpdateTxPin from './pages/UpdateTxPin';
import InterBanksTransfer from './pages/InterBanksTransfer';

function App() {

  return (
    <div className="App" style={{ padding:20 }} >
    
    <BrowserRouter>
      <Routes>
        <Route path='/' element={ <Home />} />
        <Route path='/login' element={ <Login />} />
        <Route path='/sign-up' element={ <Register/>} />
        <Route path='/fundwallet' element={ <FundWallet/>} />
        <Route path='/verifytransaction' element={ <VerifyTransaction />} />
        <Route path='/payment-success' element={ <PaymentSuccess />}  />
        <Route path='/transfer' element={<Transfer />} />
        <Route path='/set-pin' element={<SetPin/>} />
        <Route path='/update-pin' element={<UpdateTxPin/>} />
        <Route path='/interbanks-transfer' element={<InterBanksTransfer/>} />
      </Routes>
    </BrowserRouter>
    
    </div>
  );
}

export default App;
