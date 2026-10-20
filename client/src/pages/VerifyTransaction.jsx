import axios from "axios";
import React, { useState } from "react";

//verify transaction manually
const VerifyTransaction = () => {
    const [reference, setReference] = useState({});
    const token = localStorage.getItem('token');
    const [verifyMessage, setVerifyMessage] = useState("");
    const [color, setColor] = useState("");

    const handleChange = (e) => {
        setReference((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }

    const handleVerify = async (e) => {
        e.preventDefault();

        try {
            const verifyResponse = await axios.post('http://localhost:8000/api/wallet/verify',
                reference,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
           // console.log('The verification response');
           // console.log(verifyResponse)
            setVerifyMessage(verifyResponse.data.message);
            setColor(verifyResponse.data.status === 'completed' ? 'emerald' : 'rose');
            console.log(verifyMessage);

        } catch (err) {
            console.log(err + ':Failed to verify')
        }
    }

    return (
        <div className="mx-auto max-w-md w-full py-4">
            {/* Header Content */}
            <div className="mb-6">
                <h3 className="text-xl font-bold text-slate-900 tracking-tight sm:text-2xl">
                    Manual Verification
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                    Verify a deposit or transaction directly using its payment reference string.
                </p>
            </div>

            {/*  Critical Warning Alert  */}
            <div className="mb-6 rounded-xl bg-amber-50 border border-amber-200 p-4 text-sm text-amber-800 shadow-sm flex items-start gap-3">
               
                <div>
                    <span className="font-bold uppercase tracking-wider text-xs block mb-0.5">Warning</span>
                    This action directly updates the wallet balance using data retrieved from Paystack.
                </div>
            </div>

            {/*  Verification Form */}
            <form onSubmit={handleVerify} className="space-y-5">
                <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                        Transaction Reference String
                    </label>
                    <input
                        type="text"
                        name="reference"
                        placeholder="e.g. T1234567890"
                        onChange={handleChange}
                        required
                        className="block w-full rounded-xl border border-slate-300 bg-white py-3 px-4 text-base text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                    />
                </div>

                {/* Verification Trigger Button */}
                <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 active:scale-[0.99] transition-all duration-150 cursor-pointer"
                >
                     Verify Transaction
                </button>
            </form>

            {/* Clean Server Response Area */}
            {verifyMessage && (
                <div className={`mt-5 p-4 rounded-xl text-center text-sm border font-semibold tracking-tight shadow-sm
                    ${color === 'emerald'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : 'bg-rose-50 text-rose-800 border-rose-200'
                    }`}
                >
                    {verifyMessage}
                </div>
            )}
        </div>
    )
}

export default VerifyTransaction;
