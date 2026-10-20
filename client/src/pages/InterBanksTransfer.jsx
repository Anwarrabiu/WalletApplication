import React, { useEffect, useState } from "react";
import axios from 'axios';

const InterBanksTransfer = () => {
    const [banks, setBanks] = useState([])
    const [bankCode, setBankCode] = useState('');
    const [accountNumber, setAccountNumber] = useState('');
    const [accountName, setAccountName] = useState('');
    const [amount, setAmount] = useState('');
    const [pin, setPin] = useState('');
    const [message, setMessage] = useState('');
    const token = localStorage.getItem('token');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchBanks = async () => {
            try {
                const fetchBanksResponse = await axios.get('http://localhost:8000/api/wallet/banks',
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                setBanks(fetchBanksResponse.data.data);
            } catch (error) {
                console.error('Failed to load banks:', error);
            }
        };

        fetchBanks();

    }, [token]);

    useEffect(() => {
        const verifyAccount = async () => {
            if (accountNumber.length === 10 && bankCode) {
                setLoading(true);
                try {
                    const response = await axios.post(
                        'http://localhost:8000/api/wallet/verify-account',
                        {
                            bankCode, accountNumber
                        },
                        {
                            headers: { Authorization: `Bearer ${token}` }
                        }
                    );
                    setAccountName(response.data.accountName);
                    setLoading(false);
                } catch (error) {
                    setAccountName('');
                    setLoading(false);
                    console.error('Verification failed:', error);
                }
            } else {
                setAccountName('')
            }
        };
        verifyAccount();
    }, [accountNumber, bankCode, token]);

    const handleTransfer = async (e) => {
        e.preventDefault();
        try {
            const transferResponse = await axios.post('http://localhost:8000/api/wallet/interbanks-transfer',
                {
                    bankCode, accountNumber, amount, pin
                },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            setMessage(transferResponse.data.message);
            setBankCode('');
            setAccountNumber('');
            setAccountName('');
            setAmount('');
            setPin('');

        } catch (error) {
            setMessage(error.response?.data?.message || 'Transfer failed in client');
            console.log(error);
        }
    };

    return (
        <div className="mx-auto max-w-md w-full py-4">
            {/* Header Content */}
            <div className="mb-6">
                <h3 className="text-xl font-bold text-slate-900 tracking-tight sm:text-2xl">
                    Interbank Transfer
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                    Send funds instantly to other local banking institutions.
                </p>
            </div>

            <form onSubmit={handleTransfer} className="space-y-5">
                {/* Bank Selection Dropdown */}
                <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                        Destination Bank
                    </label>
                    <select
                        value={bankCode}
                        onChange={(e) => setBankCode(e.target.value)}
                        required
                        className="block w-full rounded-xl border border-slate-300 bg-white py-3 px-4 text-base text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all appearance-none"
                        style={{ backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://w3.org' fill='none' viewBox='0 0 24 24' stroke='%2364748b'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/></svg>")`, backgroundPosition: 'right 1rem center', backgroundSize: '1.25rem', backgroundRepeat: 'no-repeat' }}
                    >
                        <option value="">Select Bank</option>
                        {banks.map((bank) => (
                            <option key={bank.code} value={bank.code}>
                                {bank.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Account Number Input */}
                <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                        Account Number
                    </label>
                    <input
                        type="text"
                        placeholder="0000000000"
                        value={accountNumber}
                        onChange={(e) => setAccountNumber(e.target.value)}
                        required
                        maxLength={10}
                        className="block w-full rounded-xl border border-slate-300 bg-white py-3 px-4 text-base text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                    />

                    {/* Live Account Name Status  */}
                    <div className="min-h-[24px] mt-1.5 px-1">
                        {loading && (
                            <p className="text-xs text-blue-500 font-medium animate-pulse flex items-center gap-1.5">
                                 Verifying Account...
                            </p>
                        )}
                        {accountName && (
                            <p className="text-xs text-emerald-600 font-semibold bg-emerald-50 py-1 px-2.5 rounded-lg border border-emerald-100 inline-block">
                                 {accountName}
                            </p>
                        )}
                    </div>
                </div>

                {/* Amount Input */}
                <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                        Amount
                    </label>
                    <div className="relative rounded-xl shadow-sm">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                            <span className="text-slate-400 font-medium">₦</span>
                        </div>
                        <input
                            type="number"
                            placeholder="0.00"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            required
                            className="block w-full rounded-xl border border-slate-300 bg-white py-3 pl-9 pr-4 text-base text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                        />
                    </div>
                </div>

                {/* Transaction PIN Input */}
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
                        maxLength={4}
                        className="block w-full text-center tracking-[1em] rounded-xl border border-slate-300 bg-white py-3 px-4 text-base text-slate-900 placeholder:text-slate-400 placeholder:tracking-normal focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                    />
                </div>

                {/* Submit Action Button */}
                <button
                    type="submit"
                    disabled={!accountName}
                    className={`w-full flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold shadow-sm transition-all duration-150
            ${accountName
                            ? 'bg-blue-600 text-white hover:bg-blue-700 active:scale-[0.99] cursor-pointer'
                            : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                        }`}
                >
                     Send Money
                </button>
            </form>

            {/* Server Response Message Feedback Alert */}
            {message && (
                <div className={`mt-5 p-4 rounded-xl text-sm border font-medium ${message.toLowerCase().includes('success')
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : 'bg-rose-50 text-rose-800 border-rose-200'
                    }`}>
                    {message}
                </div>
            )}
        </div>
    );
};

export default InterBanksTransfer;
