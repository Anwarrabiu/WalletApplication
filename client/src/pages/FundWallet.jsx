import React, { useState } from "react";
//import reactDom from "react-dom";
import axios from 'axios';

const FundWallet = () => {
    const [amount, setAmount] = useState("");
    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');

    const handleFund = async () => {
        try {
            const fundRespond = await axios.post(
                'http://localhost:8000/api/wallet/fund',
                { email: user.email, amount, userId: user.id },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            //Open Paystack checkout in a new tab
            window.open(fundRespond.data.data.authorization_url, "_blank");
            alert("Payment initialized. Complete payment in the new tab.");
            console.log('Payment Initialized');
            //onFunded();

        } catch (error) {
            console.log(error);
            alert(error.response?.data?.error || "Error funding wallet!");
        }
    };

    return (
        <div className="mx-auto max-w-md w-full py-4">
            {/* Header section with modern title & description */}
            <div className="mb-6">
                <h3 className="text-xl font-bold text-slate-900 tracking-tight sm:text-2xl">
                    Fund Your Wallet
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                    Enter the amount you wish to add. You will be redirected to Paystack's secure checkout.
                </p>
            </div>

            {/* Form Container Element */}
            <div className="space-y-5">
                <div>
                    <label htmlFor="amount" className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                        Amount (NGN)
                    </label>
                    <div className="relative rounded-xl shadow-sm">
                        {/* Currency Symbol Icon Indicator */}
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                            <span className="text-slate-400 font-medium sm:text-sm">₦</span>
                        </div>
                        
                        <input 
                            id="amount"
                            type="number" 
                            placeholder="0.00" 
                            value={amount} 
                            onChange={(e) => setAmount(e.target.value)} 
                            className="block w-full rounded-xl border border-slate-300 bg-white py-3 pl-9 pr-4 text-base text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                        />
                    </div>
                </div>

                {/* Secure Payment Call-To-Action Button */}
                <button 
                    onClick={handleFund}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-all duration-150"
                >
                     Fund Now
                </button>
            </div>
            
            {/* Footer Trust badge layout */}
            <div className="mt-6 flex items-center justify-center gap-1.5 text-xs text-slate-400">
                <span>Secured by</span>
                <span className="font-bold text-slate-500 tracking-tight">Paystack</span>
            </div>
        </div>
    );
    
}

export default FundWallet;
