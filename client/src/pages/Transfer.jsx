import React, { useState } from "react";
import axios from 'axios';

const Transfer = () => {
    const [recipientEmail, setRecipientEmail] = useState('');
    const [amount, setAmount] = useState(0);
    const [message, setMessage] = useState('');
    const [pin, setPin] = useState('');
    const token = localStorage.getItem('token');

    const handleTransfer = async (e) => {
        e.preventDefault();

        try {
            const transferResponse = await axios.post('http://localhost:8000/api/wallet/transfer',
                {
                    recipientEmail, amount, pin
                },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            setMessage(transferResponse.data.message);
            setRecipientEmail('');
            setAmount(0);
            setPin('');

        } catch (error) {
            setMessage(error.response?.data?.message || 'Transfer failed. Try again later.');
        }
    };

    return (
        <div className="mx-auto max-w-md w-full py-4">
            {/* Header Section */}
            <div className="mb-6">
                <h3 className="text-xl font-bold text-slate-900 tracking-tight sm:text-2xl">
                    Transfer Funds
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                    Send funds instantly to another user's digital wallet using their registered email address.
                </p>
            </div>

            {/* Transfer Form */}
            <form onSubmit={handleTransfer} className="space-y-5">
                {/* Recipient Email Input  */}
                <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                        Recipient Email Address
                    </label>
                    <input
                        type="email"
                        placeholder="name@example.com"
                        value={recipientEmail}
                        onChange={(e) => setRecipientEmail(e.target.value)}
                        required
                        className="block w-full rounded-xl border border-slate-300 bg-white py-3 px-4 text-base text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                    />
                </div>

                {/* Amount Input  */}
                <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                        Amount to Send
                    </label>
                    <div className="relative rounded-xl shadow-sm">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                            <span className="text-slate-400 font-medium">₦</span>
                        </div>
                        <input
                            type="number"
                            placeholder="0.00"
                            value={amount === 0 ? '' : amount}
                            onChange={(e) => setAmount(Number(e.target.value))}
                            required
                            className="block w-full rounded-xl border border-slate-300 bg-white py-3 pl-9 pr-4 text-base text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                        />
                    </div>
                </div>

                {/* Transaction PIN Input  */}
                <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                        Transaction PIN
                    </label>
                    <input
                        type="password"
                        placeholder="••••"
                        value={pin}
                        onChange={(e) => setPin(e.target.value)}
                        required
                        maxLength="4"
                        className="block w-full text-center tracking-[1em] rounded-xl border border-slate-300 bg-white py-3 px-4 text-base text-slate-900 placeholder:text-slate-400 placeholder:tracking-normal focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                    />
                </div>

                {/* Submit Action Button */}
                <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 active:scale-[0.99] transition-all duration-150 cursor-pointer"
                >
                     Send Money
                </button>
            </form>

            {/* Server Response Message Feedback Alert */}
            {message && (
                <div className={`mt-5 p-4 rounded-xl text-sm border font-medium text-center ${
                    message.toLowerCase().includes('success')
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : 'bg-rose-50 text-rose-800 border-rose-200'
                }`}>
                    {message}
                </div>
            )}
        </div>
    );
};

export default Transfer;
