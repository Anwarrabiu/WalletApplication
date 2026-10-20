import React from "react";

const PaymentSuccess = () => {
    return (
        <div className="mx-auto max-w-md w-full py-8 text-center flex flex-col items-center justify-center">
            {/* Animated/Styled Vector Success Checkmark Ring */}
            <div className="h-20 w-20 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-4xl shadow-sm text-emerald-600 mb-6 animate-bounce">
                ✓
            </div>

            {/* Main Alert Message */}
            <h2 className="text-2xl font-black text-slate-900 tracking-tight sm:text-3xl">
                Payment Successful!
            </h2>
            <p className="mt-2 text-sm text-slate-500 max-w-xs">
                Your wallet balance will be updated and reflected across your dashboard shortly.
            </p>

            {/* Quick Action Navigation Helper */}
            <div className="mt-8 w-full">
                <a 
                    href="/"
                    className="w-full inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 transition-all duration-150"
                >
                    Return to Dashboard
                </a>
            </div>
        </div>
    )
}

export default PaymentSuccess;
