import React, { useState } from 'react';

const RestaurantReservation = ({ setSelectedValues }  ) => {
  const [place, setPlace] = useState('');
  const [tableNo, setTableNo] = useState('');
  const [selectedDish, setSelectedDish] = useState('');

  const handlePlaceChange = (event) => {
    setPlace(event.target.value);
  };

  const handleTableNoChange = (event) => {
    setTableNo(event.target.value);
  };

  const handleDishChange = (event) => {
    setSelectedDish(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setSelectedValues({ selectedPlace: place, selectedTableNo: tableNo, selectedDish: selectedDish });
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-gray-100 rounded-lg shadow-md">
      <form onSubmit={handleSubmit}>
        <label className="block mb-4">
          <span className="text-gray-700">Place:</span>
          <select 
            className="block w-full mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
            value={place} 
            onChange={handlePlaceChange}
          >
            <option value="">Select Place</option>
            <option value="AC">AC</option>
            <option value="Dine in">Dine in</option>
            <option value="Round table">Round table</option>
          </select>
        </label>
        <label className="block mb-4">
          <span className="text-gray-700">Table No:</span>
          <select 
            className="block w-full mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
            value={tableNo} 
            onChange={handleTableNoChange}
          >
            <option value="">Select Table No</option>
           {[...Array(7).keys()].map(num => <option key={num+1} value={num+1}>{num+1}</option>)}
          </select>
        </label>
        <label className="block mb-4">
          <span className="text-gray-700">Dish:</span>
          <input
            type="text"
            className="block w-full mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
            value={selectedDish}
            onChange={handleDishChange}
            placeholder="Enter Dish"
          />
        </label>
        <button 
          type="submit" 
          className="w-full bg-indigo-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline hover:bg-indigo-700"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default RestaurantReservation;
