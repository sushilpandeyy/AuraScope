import React from 'react';
import { Link } from 'react-router-dom';
const Navbar = () => {
  return (
    <nav className="bg-white shadow-md w-full mb-96 px-9">
      <div className="container mx-auto flex justify-between items-center px-6 py-4 max-w-screen-xl">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <div className="text-indigo-700 text-2xl font-bold">AuraScope</div>
        </div>

        {/* Language Dropdown */}
        

        {/* Nav Links */}
        <div className="hidden md:flex space-x-8">
          <a href="#" className="text-indigo-600 hover:text-indigo-800">Home</a>
          <a href="#" className="text-gray-600 hover:text-gray-800">Features</a>
          <a href="#" className="text-gray-600 hover:text-gray-800">About us</a>
          <a href="#" className="text-gray-600 hover:text-gray-800">Contact us</a>
        </div>

        {/* Start for Free Button */}
        <div>
        <Link to="/dashboard">
          <button  className="bg-indigo-600 text-white px-4 py-2 rounded-full hover:bg-indigo-800">
            Start for Free
          </button>
        </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
