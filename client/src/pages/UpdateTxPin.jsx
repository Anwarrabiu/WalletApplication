import React, { useState } from "react";
import axios from 'axios';

const UpdateTxPin = () => {
    const [password, setPassword] = useState('');
    const [newPin, setNewPin] = useState('');
    const [message, setMessage] = useState('');
    const token = localStorage.getItem('token');

    const handleUpdatePin = async (e) => {
        e.preventDefault();
        try {
            const updateResponse = await axios.post('http://localhost:8000/api/wallet/reset-pin',
                { password, newPin },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            setMessage(updateResponse.data.message);
            setNewPin('');
        } catch (error) {
            setMessage(error.response?.data?.message || 'Failed to set pin')
        }
    };

    return (
        <div className="mx-auto max-w-md w-full py-4">
            {/* Header Identity Section */}
            <div className="mb-6">
                <h3 className="text-xl font-bold text-slate-900 tracking-tight sm:text-2xl">
                    Update Wallet PIN
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                    Confirm your account login password to authorize changing or resetting your transaction PIN.
                </p>
            </div>

            {/* Core Update Form */}
            <form onSubmit={handleUpdatePin} className="space-y-5">
                {/* Account Password Field */}
                <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                        Login Password
                    </label>
                    <input
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="block w-full rounded-xl border border-slate-300 bg-white py-3 px-4 text-base text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                    />
                </div>

                {/* New PIN Field */}
                <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                        New 4-Digit PIN
                    </label>
                    <input
                        type="password"
                        placeholder="••••"
                        value={newPin}
                        onChange={(e) => setNewPin(e.target.value)}
                        required
                        maxLength={4}
                        className="block w-full text-center tracking-[1em] rounded-xl border border-slate-300 bg-white py-3 px-4 text-base text-slate-900 placeholder:text-slate-400 placeholder:tracking-normal focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                    />
                </div>

                {/* Submit Action Button */}
                <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 active:scale-[0.99] transition-all duration-150 cursor-pointer"
                >
                     Update Transaction PIN
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

export default UpdateTxPin;
