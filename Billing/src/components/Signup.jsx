// // src/components/Signup.js
// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import axios from 'axios';

// const Signup = () => {
//   const [username, setUsername] = useState(''); 
//   const [password, setPassword] = useState('');
//   const navigate = useNavigate();

//   const handleSignup = async () => {
//     try {
//       await axios.post('http://localhost:5000/api/auth/signup', { username, password });
//       navigate('/login');
//     } catch (error) {
//       console.error('Error signing up:', error);
//     }
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gray-100">
//       <div className="w-full max-w-md p-8 space-y-4 bg-white shadow-md rounded-lg">
//         <h2 className="text-2xl font-bold text-center">Signup</h2>
//         <input
//           type="text"
//           placeholder="Username"
//           value={username}
//           onChange={(e) => setUsername(e.target.value)}
//           className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
//         />
//         <input
//           type="password"
//           placeholder="Password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
//         />
//         <button
//           onClick={handleSignup}
//           className="w-full px-4 py-2 font-bold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-600"
//         >
//           Signup
//         </button>
//         <p className="text-center">
//           Already have an account? <Link to="/login" className="text-indigo-600 hover:underline">Login</Link>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Signup;

import React, { useState } from 'react';
import axios from 'axios';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/users/signup', { username, password });
      window.location.href = '/login'; // Navigate to login page
    } catch (error) {
      console.error('Error during signup', error);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-200">
      <form onSubmit={handleSignup} className="bg-white p-8 rounded shadow-md">
        <h2 className="text-2xl mb-4 text-center font-semibold">Signup</h2>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
          />
        </div>
        <div className="mb-6">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
          />
        </div>
        <div className="text-center">
          <button
            type="submit"
            className="w-full bg-indigo-500 text-white p-3 rounded hover:bg-indigo-600 focus:outline-none"
          >
            Signup
          </button>
        </div>
      </form>
    </div>
  );
};

export default Signup;

