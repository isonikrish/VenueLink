import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { MainContext } from '../../contexts/MainContext'
function Login() {
  const navigate = useNavigate();
  const { user, handleLogin } = useContext(MainContext)
  useEffect(() => {
    if (user) {
      navigate('/home')
    }
  }, [user, navigate]);
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullname: '', // Only used for sign-up
  });

  const toggleForm = () => {
    setIsLogin(prevIsLogin => !prevIsLogin);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  

  const handleSignup = async (e) => {
    e.preventDefault();
    const response = await axios.post('http://localhost:9294/api/auth/signup', formData, {
      withCredentials: true,
    })
    if (response.status === 201) {
      toast.success('Signup Successfull');
    } else {
      toast.error('Signup failed');
    }
  };

  return (
    <div className="flex justify-center items-center h-[70vh]">
      <div className="w-96 p-6 shadow-lg rounded-lg bg-white">
        <h2 className="text-2xl font-bold mb-6 text-center">
          {isLogin ? 'Login' : 'Sign Up'}
        </h2>

        <form onSubmit={isLogin ? (e) => handleLogin(e, formData) : handleSignup}>
          {isLogin ? (
            <>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-2 mb-6 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Login
              </button>
            </>
          ) : (
            <>
              <input
                type="text"
                name="fullname"
                placeholder="Full Name"
                value={formData.fullname}
                onChange={handleChange}
                className="w-full p-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-2 mb-6 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Sign Up
              </button>
            </>
          )}
        </form>

        <p className="text-center mt-4">
          {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
          <span
            className="text-blue-600 cursor-pointer hover:underline"
            onClick={toggleForm}
          >
            {isLogin ? 'Sign Up' : 'Login'}
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;
