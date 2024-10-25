import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate(); // Initialize useNavigate

  // Function to handle login request
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/login', {
        email,
        password,
      });

      if (response.data.user) {
        sessionStorage.setItem('user', JSON.stringify(response.data.user));
        navigate('/dashboard');
      } else {
        console.log('Login failed:', response.data);
      }
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

      // Save user data to session storage and navigate to dashboard if signup succeeds
      if (response.data.user) {
        sessionStorage.setItem('user', JSON.stringify(response.data.user));
        navigate('/dashboard');
      } else {
        console.log('Signup failed:', response.data);
      }
    } catch (error) {
      console.error('Signup Error:', error);
    }
  };

  // Toggle between Login and Signup forms
  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div className="flex items-center justify-center h-screen w-screen bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-sm">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          {isLogin ? 'Login' : 'Sign Up'}
        </h2>
        <form onSubmit={isLogin ? handleLogin : handleSignUp}>
          {!isLogin && (
            <div className="mb-4">
              <label className="text-gray-300" htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 mt-2 bg-gray-700 rounded-md text-white"
              />
            </div>
          )}
          <div className="mb-4">
            <label className="text-gray-300" htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 mt-2 bg-gray-700 rounded-md text-white"
            />
          </div>
          <div className="mb-6">
            <label className="text-gray-300" htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 mt-2 bg-gray-700 rounded-md text-white"
            />
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700">
            {isLogin ? 'Login' : 'Sign Up'}
          </button>
        </form>
        <button onClick={toggleForm} className="text-blue-500 mt-4 hover:underline">
          {isLogin ? 'Don’t have an account? Sign Up' : 'Already have an account? Login'}
        </button>
      </div>
    </div>
  );
};

export default Login;
