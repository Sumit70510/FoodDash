import React from 'react';
import { Link } from 'react-router-dom';
export default function HomePage() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="flex flex-col gap-4 p-6 rounded-lg bg-white">
        <Link to="/login">
          <button className="px-8 py-2 bg-orange-500 text-white rounded-md">
            Login
          </button>
         </Link>

        <button className="px-8 py-2 border border-orange-500 text-orange-500 rounded-md">
          Sign Up
        </button>
      </div>
    </div>
  );
}