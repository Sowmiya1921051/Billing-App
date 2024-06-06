// src/Dashboard.js
import { Link } from 'react-router-dom';
import { FaList, FaUser, FaCreditCard, FaSignInAlt, FaSignOutAlt, FaQuestionCircle, FaStar, FaUserCog } from 'react-icons/fa';

const handleLogout = () => {
  localStorage.removeItem('token');
  window.location.href = '/login';
};

const Dashboard = () => {
  return (
    <div className="bg-gray-800 h-full w-16 md:w-64 text-center fixed overflow-y-auto">
      <nav className="mt-10 space-y-2">
        <Link className="flex items-center justify-center md:justify-start py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 hover:text-white text-gray-400 w-full" to="/menulist">
          <FaList className="mr-0 md:mr-2" /> <span className="hidden md:inline">MenuList</span>
        </Link>
        <Link className="flex items-center justify-center md:justify-start py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 hover:text-white text-gray-400 w-full" to="/adminComponent">
          <FaUserCog className="mr-0 md:mr-2" /> <span className="hidden md:inline">Admin Component</span>
        </Link>
        <Link className="flex items-center justify-center md:justify-start py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 hover:text-white text-gray-400 w-full" to="/orderedData">
          <FaUserCog className="mr-0 md:mr-2" /> <span className="hidden md:inline">Ordered Data</span>
        </Link>
        <Link className="flex items-center justify-center md:justify-start py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 hover:text-white text-gray-400 w-full" to="/stock">
          <FaUserCog className="mr-0 md:mr-2" /> <span className="hidden md:inline">Stock</span>
        </Link>
        <Link className="flex items-center justify-center md:justify-start py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 hover:text-white text-gray-400 w-full" to="/sales">
          <FaUserCog className="mr-0 md:mr-2" /> <span className="hidden md:inline">Sales</span>
        </Link>
        <Link className="flex items-center justify-center md:justify-start py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 hover:text-white text-gray-400 w-full" to="/reviews">
          <FaStar className="mr-0 md:mr-2" /> <span className="hidden md:inline">Customer Reviews</span>
        </Link>
        <Link className="flex items-center justify-center md:justify-start py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 hover:text-white text-gray-400 w-full" to="/account">
          <FaUser className="mr-0 md:mr-2" /> <span className="hidden md:inline">My Account</span>
        </Link>
        <Link className="flex items-center justify-center md:justify-start py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 hover:text-white text-gray-400 w-full" to="/payment">
          <FaCreditCard className="mr-0 md:mr-2" /> <span className="hidden md:inline">Payment</span>
        </Link>
        <Link className="flex items-center justify-center md:justify-start py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 hover:text-white text-gray-400 w-full" to="/signup">
          <FaSignInAlt className="mr-0 md:mr-2" /> <span className="hidden md:inline">Sign Up</span>
        </Link>
        <Link className="flex items-center justify-center md:justify-start py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 hover:text-white text-gray-400 w-full" to="/login">
          <FaSignInAlt className="mr-0 md:mr-2" /> <span className="hidden md:inline">Login</span>
        </Link>
        <Link className="flex items-center justify-center md:justify-start py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 hover:text-white text-gray-400 w-full" to="/help">
          <FaQuestionCircle className="mr-0 md:mr-2" /> <span className="hidden md:inline">Help</span>
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center justify-center md:justify-start px-4 py-2.5 rounded transition duration-200 hover:bg-gray-700 hover:text-white text-gray-400 w-full"
        >
          <FaSignOutAlt className="mr-0 md:mr-2" /> <span className="hidden md:inline">Logout</span>
        </button>
      </nav>
    </div>
  );
};

export default Dashboard;
