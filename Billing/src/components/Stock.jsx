// src/components/DishList.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';

const DishList = () => {
  const [dishes, setDishes] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/dishes')
      .then(response => {
        setDishes(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the data!', error);
      });
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Dishes</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {dishes.map(dish => (
          <div key={dish._id.$oid} className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="p-4">
              <h2 className="text-xl font-semibold">{dish.name}</h2>
              <h2 className="text-xl font-semibold">{dish.stock}</h2>
              <p className="text-gray-600">Category: {dish.category}</p>
              <p className="text-gray-600">Subcategory: {dish.subcategory}</p>
              <p className="text-gray-800">Price: ₹{dish.originalPrice}</p>
              <p className="text-gray-800">Price with GST: ₹{dish.priceWithGST}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DishList;
