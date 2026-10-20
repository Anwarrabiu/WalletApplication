import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [user, setUser] = useState({
        name: '',
        email: '',
        password: ''
    });
    const [msg, setMsg] = useState("");

    const navigate = useNavigate();

    const handleChange = (e) => {
        setUser((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const registerResponse = await axios.post('http://localhost:8000/api/auth/register', user);
            console.log(registerResponse);

            if (registerResponse.statusText === 'Created') {
                setMsg("Registration Successful!");
                //localStorage is not secure
                localStorage.setItem('token', registerResponse.data.token);
                localStorage.setItem('user', JSON.stringify(registerResponse.data.user));
                navigate('/');
            }
        } catch (err) {
            console.log("Error Registering !!!! :" + err);
        }
    }

    return (
        <div className="mx-auto max-w-md w-full py-6 sm:py-8">
            {/* Header Section */}
            <div className="text-center mb-8">
               
                <h3 className="text-2xl font-bold tracking-tight text-slate-900">
                    Create Your Account
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                    Get started in seconds to receive your secure digital wallet.
                </p>
            </div>

            {/* Registration Form */}
            <form onSubmit={handleRegister} className="space-y-5">
                {/* Full Name Input  */}
                <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                        Full Name
                    </label>
                    <input
                        type="text"
                        name="name"
                        placeholder="Anwar Rabiu"
                        onChange={handleChange}
                        required
                        className="block w-full rounded-xl border border-slate-300 bg-white py-3 px-4 text-base text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                    />
                </div>

                {/* Email Address Input  */}
                <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                        Email Address
                    </label>
                    <input
                        type="email"
                        name="email"
                        placeholder="name@example.com"
                        onChange={handleChange}
                        required
                        className="block w-full rounded-xl border border-slate-300 bg-white py-3 px-4 text-base text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                    />
                </div>

                {/* Password Input Block */}
                <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                        Password
                    </label>
                    <input
                        type="password"
                        name="password"
                        placeholder="••••••••"
                        onChange={handleChange}
                        required
                        className="block w-full rounded-xl border border-slate-300 bg-white py-3 px-4 text-base text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                    />
                </div>

                {/* Sign Up Button  */}
                <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 active:scale-[0.99] transition-all duration-150 cursor-pointer"
                >
                    Create Account
                </button>
            </form>

            {/* Sign In Link */}
            <div className="mt-6 text-center text-sm text-slate-500">
                Already have an account?{" "}
                <button
                    onClick={() => navigate('/login')}
                    className="font-semibold text-blue-600 hover:text-blue-700 hover:underline bg-transparent border-none p-0 cursor-pointer transition-colors"
                >
                    Sign In
                </button>
            </div>

            {/* Status Alert Notification Panel */}
            {msg && (
                <div className="mt-5 p-4 rounded-xl text-center text-sm font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
                     {msg}
                </div>
            )}
        </div>
    )
}

export default Register;
