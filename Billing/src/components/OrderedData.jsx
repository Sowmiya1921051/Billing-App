import React, { useState, useEffect } from 'react';
import axios from 'axios';

const OrderedData = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        <div className="grid grid-cols-1 gap-4">
          {orders.map((order) => (
            <div key={order._id.$oid} className="border p-4 rounded shadow-md">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-semibold">Order ID: {order._id.$oid}</h3>
                <span className="text-gray-600">Status: {order.status}</span>
              </div>
              <div className="flex items-center mb-2">
                <img src={`http://localhost:5000/${order.imageUrl}`} alt="Order" className="w-16 h-16 object-cover mr-2" />
                <p>Created At: {order.createdAt}</p>
              </div>
              <table className="w-full table-auto">
                <thead>
                  <tr>
                    <th className="px-4 py-2">Name</th>
                    <th className="px-4 py-2">Quantity</th>
                    <th className="px-4 py-2">Total Price</th>
                    <th className="px-4 py-2">GST Price</th>
                  </tr>
                </thead>
                <tbody>
                  {order.orders.map((item) => (
                    <tr key={item._id.$oid} className="text-center">
                      <td className="border px-4 py-2">{item.name}</td>
                      <td className="border px-4 py-2">{item.quantity}</td>
                      <td className="border px-4 py-2">{item.totalPrice}</td>
                      <td className="border px-4 py-2">{item.gstPrice}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderedData;
