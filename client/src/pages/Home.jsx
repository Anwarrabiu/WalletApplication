import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import Dashboard from "./Dashboard";


const Home = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setCurrentUser(null);
    navigate('/login');
    console.log('Logged out successfully');
  };

  return (
    <div className="w-full space-y-6">
      {currentUser ? (
        /* LOGGED IN ACTIVE DASHBOARD VIEW */
        <div className="space-y-6">
          {/* Header Dashboard Welcome Panel */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <p className="text-sm font-medium text-slate-400 uppercase tracking-wider">Welcome back</p>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                {currentUser.name || 'User'}
              </h2>
            </div>
            
            {/*  profile corner */}
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                ● Account Active
              </span>
              <button 
                onClick={handleLogout}
                className="text-xs font-semibold text-rose-600 hover:bg-rose-50 hover:text-rose-700 px-3 py-1.5 rounded-lg border border-rose-200 transition-all duration-200"
              >
                Log Out
              </button>
            </div>
          </div>

          {/* Rendering nested dashboard component layout inside */}
          <Dashboard logout={handleLogout} />
        </div>
      ) : (
        /* GUEST or LOGGED OUT WELCOME STATE */
        <div className="flex flex-col items-center text-center py-12 px-4 sm:py-16">
                   
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
            Secure Digital Banking
          </h2>
          <p className="mt-3 max-w-md text-base text-slate-500 sm:text-lg">
            Manage your funds, handle domestic transfers, and protect your digital wallet inside a secure environment.
          </p>
          
          {/* Call To Action Feature Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row gap-3 w-full sm:w-auto justify-center">
            <button 
              onClick={() => navigate('/login')} 
              className="w-full sm:w-auto inline-flex justify-center items-center px-6 py-3 border border-slate-200 text-sm font-semibold text-slate-700 bg-white rounded-xl shadow-sm hover:bg-slate-50 hover:text-slate-900 transition-all duration-200"
            >
              Sign In
            </button>
            <button 
              onClick={() => navigate('/sign-up')} 
              className="w-full sm:w-auto inline-flex justify-center items-center px-6 py-3 text-sm font-semibold text-white bg-blue-600 rounded-xl shadow-sm hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-all duration-200"
            >
              Create Free Account
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;