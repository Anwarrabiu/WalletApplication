import React, {useState, useEffect} from 'react';
//import reactDom from 'react-dom/client';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
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
  const [currentUser, setCurrentUser] = useState({});
  const user1 = localStorage.getItem('user');

   useEffect(()=>{
          setCurrentUser(JSON.parse(localStorage.getItem('user')));
         
      }, []);
      

  return (
    <div className="App ">
      <BrowserRouter>
        
        {/*  BRAND HEADER */}
        <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/80 backdrop-blur-md">
          <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8 flex items-center justify-between">
            <Link to="/" className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
              <span className="h-6 w-6 rounded bg-blue-600 flex items-center justify-center text-white text-xs font-black">₦</span>
              <span className="text-blue-600">KeyPAY</span>
            </Link>
            
            {/*  Secondary Navigation actions */}
            { !currentUser ?
            <div className="flex items-center gap-3">
              
              <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors px-3 py-1.5 rounded-lg hover:bg-slate-100">
                Log In
              </Link> 
              <Link to="/sign-up" className="text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors px-4 py-1.5 rounded-lg shadow-sm">
                Get Started
              </Link>
            </div>  : " " }
          </div>
        </header>

        {/* MAIN LAYOUT WRAPPER */}
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
            
            {/* SIDEBAR NAVIGATION */}
            <nav className="grid grid-cols-2 gap-2 pb-3 sm:grid-cols-3 lg:flex lg:flex-col lg:pb-0 lg:col-span-1">
              <p className="hidden lg:block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 px-3">Core Account</p>
              
              <Link to="/" className="whitespace-nowrap flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-xl bg-blue-50 text-blue-700 transition-colors">
                 Dashboard
              </Link>
              <Link to="/fundwallet" className="whitespace-nowrap flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors">
                 Fund Wallet
              </Link>
              <Link to="/transfer" className="whitespace-nowrap flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors">
                 Local Transfer
              </Link>
              <Link to="/interbanks-transfer" className="whitespace-nowrap flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors">
                 Inter-Bank
              </Link>

              <div className="hidden lg:block my-4 border-t border-slate-200" />
              <p className="hidden lg:block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 px-3">Security Settings</p>

              <Link to="/set-pin" className="whitespace-nowrap flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors">
                 Set Tx Pin
              </Link>
              <Link to="/update-pin" className="whitespace-nowrap flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors">
                 Update Pin
              </Link>
            </nav>

            {/* CORE CONTENT PANEL  */}
            <main className="lg:col-span-3">
              <div className="min-h-[500px] w-full rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-6 md:p-8 lg:p-10 shadow-sm">
                <Routes>
                  
                  <Route path='/' element={ <Home />} />
                  <Route path='/login' element={ <Login />} />
                  <Route path='/sign-up' element={ <Register />} />
                  <Route path='/fundwallet' element={ <FundWallet />} />
                  <Route path='/verifytransaction' element={ <VerifyTransaction />} />
                  <Route path='/payment-success' element={ <PaymentSuccess />}  />
                  <Route path='/transfer' element={ <Transfer />} />
                  <Route path='/set-pin' element={ <SetPin />} />
                  <Route path='/update-pin' element={ <UpdateTxPin />} />
                  <Route path='/interbanks-transfer' element={ <InterBanksTransfer />} />
                </Routes>
              </div>
            </main>

          </div>
        </div>

      </BrowserRouter>
    </div>
  );
}

export default App;
