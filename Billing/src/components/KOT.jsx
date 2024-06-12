import React, { useState, useEffect } from 'react';
import axios from 'axios';

const KOT = () => {
  const [kitchenOrders, setKitchenOrders] = useState([]);
  const [tableOrders, setTableOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch kitchen orders
        const kitchenResponse = await axios.get('http://localhost:5000/api/orders');
        setKitchenOrders(kitchenResponse.data);

        // Fetch table orders
        const tableResponse = await axios.get('http://localhost:5000/api/tableOrders');
        setTableOrders(tableResponse.data);
      } catch (error) {
        setError('Error fetching orders. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const updateOrderStatus = async (orderId, status, isTableOrder = false) => {
    try {
      const url = isTableOrder 
        ? `http://localhost:5000/api/tableOrders/${orderId}/status` 
        : `http://localhost:5000/api/orders/${orderId}/status`;

      await axios.put(url, { status });

      // Update the state to reflect the status change
      if (isTableOrder) {
        setTableOrders(prevOrders =>
          prevOrders.map(order =>
            order._id === orderId ? { ...order, status } : order
          )
        );
      } else {
        setKitchenOrders(prevOrders =>
          prevOrders.map(order =>
            order._id === orderId ? { ...order, status } : order
          )
        );
      }
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
          <h2 className="text-3xl font-bold mb-8">Kitchen Order Tickets</h2>

      <div className="flex justify-center w-full">
        {/* Kitchen Orders */}
        <div className="max-w-md w-full bg-blue-200 shadow-md p-8 rounded-lg mr-4">
        <h2 className="text-3xl font-bold mb-8">Take Orders</h2>
          <ul>
            {kitchenOrders.map(order => (
              <li key={order._id} className="mb-4 p-4 bg-blue-100 rounded-lg shadow-md">
                <h3 className=" font-semibold">Order ID: {order._id}</h3>
                <ul className="mt-2 ">
                  {order.items.map(item => (
                    <li key={item.id} className="ml-4">
                      {item.name} - Quantity: {item.count}
                    </li>
                  ))}
                </ul>
                <p className='font-bold text-lg'>Status: {order.status || 'Pending'}</p>
                <div className="mt-2">
                  <button 
                    className="bg-green-500 text-white px-2 py-1 rounded mr-2"
                    onClick={() => updateOrderStatus(order._id, 'Completed')}
                  >
                    Completed
                  </button>
                  <button 
                    className="bg-red-500 text-white px-2 py-1 rounded"
                    onClick={() => updateOrderStatus(order._id, 'Rejected')}
                  >
                    Rejected
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Table Orders */}
        <div className="max-w-md w-full bg-green-200 shadow-md p-8 rounded-lg">
          <h2 className="text-3xl font-bold mb-8">Table Orders</h2>
          <ul>
            {tableOrders.map(order => (
              <li key={order._id} className="mb-4 p-4 bg-green-100 rounded-lg shadow-md">
                <h3 className=" font-semibold">Order ID: {order._id}</h3>
                <p className="mt-2 font-bold">Table Number: {order.tableNumber}</p>
                <p className="mt-2 font-bold">Place: {order.place}</p>
                <ul className="mt-2">
                  {order.orders.map(item => (
                    <li key={item.name} className="ml-4">
                      {item.name} - Quantity: {item.quantity}
                    </li>
                  ))}
                </ul>
                <p className='font-bold text-lg'>Status: {order.status || 'Pending'}</p>
                <div className="mt-2">
                  <button 
                    className="bg-green-500 text-white px-2 py-1 rounded mr-2"
                    onClick={() => updateOrderStatus(order._id, 'Completed', true)}
                  >
                    Completed
                  </button>
                  <button 
                    className="bg-red-500 text-white px-2 py-1 rounded"
                    onClick={() => updateOrderStatus(order._id, 'Rejected', true)}
                  >
                    Rejected
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default KOT;
