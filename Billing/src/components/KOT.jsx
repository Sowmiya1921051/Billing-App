import React, { useState, useEffect } from 'react';
import axios from 'axios';

const KOT = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get('http://localhost:5000/api/orders');
        setOrders(response.data);
      } catch (error) {
        setError('Error fetching orders. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-3xl font-bold mb-8">Kitchen Order Tickets</h2>
      <div className="max-w-md w-full bg-white shadow-md p-8 rounded-lg">
        <ul>
          {orders.map(order => (
            <li key={order._id} className="mb-4">
              <h3 className="text-xl font-semibold">Order ID: {order._id}</h3>
              <ul>
                {order.items.map(item => (
                  <li key={item.id} className="ml-4">
                    {item.name} - Quantity: {item.count}
                  </li>
                ))}
              </ul>
              <p className="mt-2">Total Price: ${order.totalPrice.toFixed(2)}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default KOT;
