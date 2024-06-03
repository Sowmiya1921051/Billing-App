import { Link } from 'react-router-dom';

const handleLogout = () => {
  localStorage.removeItem('token');
  window.location.href = '/login';
};

const Dashboard = () => {
  return (
    <div className="bg-gray-800 h-screen w-64 fixed text-center">
      <div className="flex items-center justify-center h-16 bg-gray-900">
        <Link to="/" className="text-white text-xl font-bold">BrandName</Link>
      </div>
      <nav className="mt-10">
        <Link className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 hover:text-white text-gray-400" to="/menulist">
          MenuList
        </Link>
        <Link className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 hover:text-white text-gray-400 mt-4" to="/">
          Sign Up
        </Link>
        <Link className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 hover:text-white text-gray-400 mt-4" to="/login">
          Login
        </Link>
        <button
          onClick={handleLogout}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 mt-4"
        >
          Logout
        </button>
      </nav>
    </div>
  );
};

export default Dashboard;
