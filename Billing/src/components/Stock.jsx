import React, { useState, useEffect } from 'react';
import axios from 'axios';

const OrderedData = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortedDishes, setSortedDishes] = useState([]);

  // Fetch orders from the backend
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/orderedList');
      setOrders(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError('Error fetching orders');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    if (orders.length > 0) {
      const dishesMap = new Map();
      orders.forEach(order => {
        order.orders.forEach(item => {
          if (dishesMap.has(item.name)) {
            dishesMap.set(item.name, dishesMap.get(item.name) + item.quantity);
          } else {
            dishesMap.set(item.name, item.quantity);
          }
        });
      });
      const sortedDishesArray = Array.from(dishesMap.entries()).sort((a, b) => b[1] - a[1]);
      setSortedDishes(sortedDishesArray);
    }
  }, [orders]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white shadow-md rounded p-6 w-full max-w-4xl">
        <h2 className="text-2xl font-bold mb-4">Order Data</h2>
        {sortedDishes.length > 0 && (
          <div className="mb-4">
            <h3 className="text-lg font-semibold">Dishes Ordered by Total Sales:</h3>
            <ul className="list-disc ml-5">
              {sortedDishes.map(([dish, quantity], index) => (
                <li key={index} className="mt-2">{dish} - {quantity} orders</li>
              ))}
            </ul>
          </div>
        )}
       
      </div>
    </div>
  );
};

export default OrderedData;
