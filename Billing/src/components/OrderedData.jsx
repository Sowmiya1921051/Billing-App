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
    <div className="min-h-screen bg-gray-100 grid grid-cols-5">
      {/* Navigation Bar */}
      <nav className="col-span-1 bg-gray-800 text-white p-4">
        {/* Navigation items */}
      </nav>
      
      <div className="col-span-4 p-8 overflow-y-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Order Data */}
        {orders.map((order) => (
          <div
            key={order._id.$oid}
            className={`border p-4 rounded shadow-md ${
              order.status === 'Ordered' ? 'bg-green-100 border-green-500' :
              order.status === 'Rejected' ? 'bg-red-100 border-red-500' : 'bg-yellow-100 border-yellow-500'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-gray-600">Order ID: {order._id}</h3>
              <span
                className={`text-lg font-semibold ${
                  order.status === 'Ordered' ? 'text-green-500' : 
                  order.status === 'Rejected' ? 'text-red-600' : 'text-yellow-600'
                }`}
              >
                Status: {order.status}
              </span>
            </div>
            <p className='text-black text-sm'>Created At: {order.createdAt}</p>

            <div className="flex items-center mb-2">
              <img src={`http://localhost:5000/${order.imageUrl}`} alt="Order" className="w-36 h-auto object-cover" />
            </div>
            <table className="w-full table-auto">
              <thead>
                <tr>
                  <th className="px-4 py-2">Name</th>
                  <th className="px-4 py-2">Quantity</th>
                  <th className="px-4 py-2">Total Price</th>
                </tr>
              </thead>
              <tbody>
                {order.orders.map((item) => (
                  <tr key={item._id.$oid} className="text-center">
                    <td className="border px-4 py-2">{item.name}</td>
                    <td className="border px-4 py-2">{item.quantity}</td>
                    <td className="border px-4 py-2">{item.totalPrice}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderedData;
