import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateField, resetUserState, loginSuccess } from '../store/userSlice';
import { useNavigate } from 'react-router-dom';
import Background from './Background';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { FcGoogle } from 'react-icons/fc';
import { useGoogleLogin } from "@react-oauth/google";

function Signup() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { username = '', email = '', password = '' } = useSelector((state) => state.user || {});

  const handleChange = (e) => {
    dispatch(updateField({ field: e.target.name, value: e.target.value }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (username && email && password) {
      try {
        const response = await axios.post('http://localhost:5000/api/user/signup',
          { username, email, password },
          {
            withCredentials: true,
            headers: {
              'Content-Type': 'application/json'
            }
          });
        if (response.status == 201) {
          dispatch(resetUserState())
          toast.success('Account created successfully! Signin to continue', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          navigate('/signin');
        }
      }
      catch (err) {
        const errorMessage = err?.response?.data?.message || 'Signup failed. Please try again.';
        toast.error(errorMessage, {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    };

  }

  const googleLogin = useGoogleLogin({
  flow: "auth-code",
  onSuccess: async (response) => {
    try { 
      const res = await axios.post(
        "http://localhost:5000/api/user/google",
        { code: response.code },
        { withCredentials: true }
      );
      dispatch(loginSuccess({username: res?.data?.user?.username||'User', password: res?.data?.user?.password||''}));  
      toast.success('Google Auth successfull!', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          navigate("/home");
    } catch (err) {
      const errorMessage = err?.response?.data?.message || 'Google Auth failed. Please try again.';
        toast.error(errorMessage, {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
    }
  },
  onError: () => {
    toast.error("Google Auth failed. Please try again.", {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
  }
});

  return (
    <div className="fixed inset-0 bg-[#f8f5fd] overflow-hidden flex flex-col items-center justify-center px-4 sm:px-6 py-6">
      <Background />

      <div className="relative z-10 flex flex-col items-center space-y-4 text-center mb-4">
        <h1 className="text-4xl md:text-4xl font-bold text-[#5d4a7a]">MindScribe</h1>
      </div>

      <div className="relative z-10 w-full bg-white rounded-2xl shadow-xl sm:max-w-md dark:bg-gray-800 dark:border dark:border-gray-700">
        <div className="p-6 space-y-6">
          <h2 className="text-xl font-semibold text-[#5d4a7a] dark:text-white">
            Create your account
          </h2>
          <form className="space-y-3" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-[#5d4a7a] dark:text-white mb-1">Username</label>
              <input
                type="text"
                name="username"
                id="username"
                value={username}
                onChange={handleChange}
                placeholder="Username"
                className="w-full rounded-lg border border-[#ccbce8] bg-gray-50 p-2 text-gray-800 shadow-sm focus:ring-2 focus:ring-[#b3a0d9] dark:bg-gray-700 dark:text-white"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#5d4a7a] dark:text-white mb-1">Email</label>
              <input
                type="email"
                name="email"
                id="email"
                value={email}
                onChange={handleChange}
                placeholder="name@gmail.com"
                className="w-full rounded-lg border border-[#ccbce8] bg-gray-50 p-2 text-gray-800 shadow-sm focus:ring-2 focus:ring-[#b3a0d9] dark:bg-gray-700 dark:text-white"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#5d4a7a] dark:text-white mb-1">Password</label>
              <input
                type="password"
                name="password"
                id="password"
                value={password}
                onChange={handleChange}
                placeholder="••••••"
                className="w-full rounded-lg border border-[#ccbce8] bg-gray-50 p-2 text-gray-800 shadow-sm focus:ring-2 focus:ring-[#b3a0d9] dark:bg-gray-700 dark:text-white"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full mt-2 bg-[#b3a0d9] hover:bg-[#9c89c0] text-white font-medium py-2 rounded-lg shadow-md hover:shadow-lg transition-all"
              onSubmit={handleSubmit}
            >
              Sign up
            </button>
          </form>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-[#b3a0d9] hover:bg-[#9c89c0] text-white font-medium py-2 rounded-lg shadow-md hover:shadow-lg transition-all"
            onClick={googleLogin}
          >
            <FcGoogle size={22} />
            <span >Continue with Google</span>
          </button>

          <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => navigate('/signin')}
              className="text-[#b3a0d9] font-medium hover:underline"
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;
