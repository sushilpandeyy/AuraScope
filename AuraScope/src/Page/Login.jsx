import React, { useState } from 'react';
import axios from 'axios'; // Import axios

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState(''); // State for signup name
  const [isLogin, setIsLogin] = useState(true); // State to toggle between Login and Signup

  // Function to handle login request
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/login', {
        email,
        password,
      });
      console.log('Login Response:', response.data);
    } catch (error) {
      console.error('Login Error:', error);
    }
  };

  // Function to handle signup request
  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/signup', {
        name,
        email,
        password,
      });
      console.log('Signup Response:', response.data);
    } catch (error) {
      console.error('Signup Error:', error);
    }
  };

  // Toggle between Login and Signup forms
  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  return (
    <>
      <div className="flex items-center justify-center h-screen w-screen bg-gray-900">
        <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-sm">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            {isLogin ? 'Login' : 'Sign Up'}
          </h2>
          <form onSubmit={isLogin ? handleLogin : handleSignUp}>
            {!isLogin && (
              <div className="mb-4">
                <label className="block text-gray-400 mb-2">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required={!isLogin} // Required in signup mode
                />
              </div>
            )}
            <div className="mb-4">
              <label className="block text-gray-400 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-400 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-md transition-colors"
            >
              {isLogin ? 'Login' : 'Sign Up'}
            </button>
          </form>

          <div className="mt-4 text-center">
            <p className="text-gray-400">
              {isLogin ? "Don't have an account?" : 'Already have an account?'}
            </p>
            <button
              onClick={toggleForm}
              className="mt-2 text-blue-400 hover:text-blue-500"
            >
              {isLogin ? 'Sign Up' : 'Login'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
