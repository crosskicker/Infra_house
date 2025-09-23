import { Link } from "react-router-dom";
import Login from "./login";
import { useState } from 'react'




function HomePage() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full bg-gray-100">
      <h1 className="text-4xl font-bold mb-8">Welcome to InfraHouse</h1>
      
      
      {!isLoggedIn && (
        <Login setIsLoggedIn={setIsLoggedIn} />
      )}
      {isLoggedIn && (
        <div className="space-x-4">
          <p className="text-lg mb-6">Your one-stop solution for managing virtual machines and services.</p>
        <Link
          to="/vm/create"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Deploy a VM
        </Link>
        <Link
          to="/service/deploy"
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
        >
          Deploy a Service
        </Link>
        <Link
          to="/infrastructure"
          className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
        >
          View Infrastructure
        </Link>
      </div>
      )}
    </div>
  );
}

export default HomePage;