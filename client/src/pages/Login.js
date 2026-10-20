import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [user, setUser] = useState({
        email: " ",
        password: " "
    });
    const [msg, setMsg] = useState("");

    const navigate = useNavigate();

    const handleChange = (e) => {
        setUser((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const loginResponse = await axios.post('http://localhost:8000/api/auth/login', user);
            console.log("Login Successfull!");
            console.log(loginResponse);

            if (loginResponse.statusText === 'OK') {
                setMsg("Successfully Loggedin");
                //using localStorage is not secure
                localStorage.setItem('token', loginResponse.data.token);
                localStorage.setItem('user', JSON.stringify(loginResponse.data.user));
                console.log(localStorage.getItem('user'));
                navigate('/');
            }

        } catch (err) {
            console.log(err);
        }
    }

    return (
        <div className="mx-auto max-w-md w-full py-6 sm:py-8">
            {/* Header Identity Section */}
            <div className="text-center mb-8">
               
                <h3 className="text-2xl font-bold tracking-tight text-slate-900">
                    Welcome Back
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                    Log in to securely manage your digital bank wallet.
                </p>
            </div>

            {/* Authentication Core Form */}
            <form onSubmit={handleLogin} className="space-y-5">
                {/* Email Address Input Block */}
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

                {/* Primary Action Button (Sign In) */}
                <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 active:scale-[0.99] transition-all duration-150 cursor-pointer"
                >
                    Sign In
                </button>
            </form>

            {/* Inline Navigation Prompt (Sign Up Link) */}
            <div className="mt-6 text-center text-sm text-slate-500">
                Don't have an account?{" "}
                <button
                    onClick={() => navigate('/sign-up')}
                    className="font-semibold text-blue-600 hover:text-blue-700 hover:underline bg-transparent border-none p-0 cursor-pointer transition-colors"
                >
                    Sign up for free
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

export default Login;
