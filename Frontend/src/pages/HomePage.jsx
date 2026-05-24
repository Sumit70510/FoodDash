import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';

export default function HomePage() {
  return (
    <div className="flex flex-col w-full min-h-screen">
      <Navbar />
      <div className="flex justify-center items-center min-h-[90vh] bg-gray-50 text-red-500">
        <div className="flex flex-col gap-4 p-6 rounded-lg bg-white text-red-500">
          <Link to="/login" className="px-8 py-2 bg-blue-400 text-white rounded-md text-center">
            Login
          </Link>
          <Link to="/signup" className="px-8 py-2 bg-blue-400 text-white rounded-md text-center">
            Signup
          </Link>
        </div>
      </div>
    </div>
  );
}