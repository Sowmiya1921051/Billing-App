import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SalesDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortedDishes, setSortedDishes] = useState([]);
  const [sales, setSales] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());

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
        if (order.status === "Ordered") {
          order.orders.forEach(item => {
            if (dishesMap.has(item.name)) {
              dishesMap.set(item.name, dishesMap.get(item.name) + item.quantity);
            } else {
              dishesMap.set(item.name, item.quantity);
            }
          });
        }
      });
      const sortedDishesArray = Array.from(dishesMap.entries()).sort((a, b) => b[1] - a[1]);
      setSortedDishes(sortedDishesArray);

      const processedSales = orders.reduce((acc, order) => {
        if (order.status === "Ordered") {
          order.orders.forEach(item => {
            const date = new Date(order.createdAt).toLocaleDateString();
            acc.push({
              date,
              name: item.name,
              quantity: item.quantity,
              totalPrice: item.totalPrice,
              gstPrice: item.gstPrice
            });
          });
        }
        return acc;
      }, []);
      setSales(processedSales);
    }
  }, [orders]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <div className="bg-white shadow-md rounded p-6 w-full max-w-4xl mb-8">
        <h2 className="text-2xl font-bold mb-4">Order Data</h2>
        <div className="mb-4">
          <h3 className="text-lg font-semibold">
            Current Date and Time: {currentTime.toLocaleDateString()} {currentTime.toLocaleTimeString()}
          </h3>
        </div>
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
      <div className="bg-white shadow-md rounded p-6 w-full max-w-4xl">
        <h2 className="text-2xl font-bold mb-6 text-center">Sales Report</h2>
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-2 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-4 py-2 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-4 py-2 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
              <th className="px-4 py-2 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Price</th>
              {/* <th className="px-4 py-2 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">GST Price</th> */}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sales.map((sale, index) => (
              <tr key={index} className="hover:bg-gray-100">
                <td className="px-4 py-2 whitespace-nowrap">{sale.date}</td>
                <td className="px-4 py-2 whitespace-nowrap">{sale.name}</td>
                <td className="px-4 py-2 whitespace-nowrap">{sale.quantity}</td>
                <td className="px-4 py-2 whitespace-nowrap">{sale.totalPrice}</td>
                {/* <td className="px-4 py-2 whitespace-nowrap">{sale.gstPrice}</td> */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SalesDashboard;
