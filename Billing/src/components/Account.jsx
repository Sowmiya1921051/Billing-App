import React, { useState, useEffect } from 'react';

const Account = () => {
  const [editMode, setEditMode] = useState(false);
  const [details, setDetails] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });

  // Load details from local storage if available
  useEffect(() => {
    const storedDetails = localStorage.getItem('userDetails');
    if (storedDetails) {
      setDetails(JSON.parse(storedDetails));
    }
  }, []);

  // Save details to local storage
  const saveDetails = () => {
    localStorage.setItem('userDetails', JSON.stringify(details));
    setEditMode(false);
  };

  const handleChange = (e) => {
    setDetails({
      ...details,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-1/4 p-4  ">
        {/* Sidebar content */}
      </div>

      {/* Account Details */}
      <div className="w-3/4 p-6 flex justify-center items-center">
        <div className="max-w-md w-full border-indigo-500 border-4 bg-white p-6 rounded-lg shadow-lg ">
          <h2 className="text-2xl font-bold mb-6 text-center">Account Details</h2>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              value={details.name}
              onChange={handleChange}
              disabled={!editMode}
              className="mt-1 p-2 border-b border-indigo-500 w-full rounded-none appearance-none focus:outline-none focus:border-indigo-500 h-10 bg-white"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={details.email}
              onChange={handleChange}
              disabled={!editMode}
              className="mt-1 p-2 border-b border-indigo-500 w-full rounded-none appearance-none focus:outline-none focus:border-indigo-500 h-10 bg-white"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <input
              type="tel"
              name="phone"
              value={details.phone}
              onChange={handleChange}
              disabled={!editMode}
              className="mt-1 p-2 border-b border-indigo-500 w-full rounded-none appearance-none focus:outline-none focus:border-indigo-500 h-10 bg-white"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Address</label>
            <textarea
              name="address"
              value={details.address}
              onChange={handleChange}
              disabled={!editMode}
              className="mt-1 p-2 border-b border-indigo-500 w-full rounded-none appearance-none focus:outline-none focus:border-indigo-500 h-10 bg-white"
            />
          </div>
          {editMode ? (
            <button
              onClick={saveDetails}
              className="mt-4 bg-indigo-500 text-white py-2 px-4 rounded-md w-full"
            >
              Save
            </button>
          ) : (
            <button
              onClick={() => setEditMode(true)}
              className="mt-4 bg-indigo-400 text-white py-2 px-4 rounded-md w-full"
            >
              Edit
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Account;
