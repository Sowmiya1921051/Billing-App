// OrderPage.jsx
import React from 'react';
import { useLocation } from 'react-router-dom';

const OrderPage = () => {
  const location = useLocation();
  const { orders } = location.state || { orders: {} };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center">
      <h2 className="text-3xl font-bold my-8">Order Summary</h2>
      <ul className="w-full max-w-4xl bg-white rounded-lg shadow-md p-4">
        {Object.keys(orders).length === 0 ? (
          <p>No orders submitted.</p>
        ) : (
          Object.entries(orders).map(([id, order]) => (
            <li key={id} className="mb-4">
              <h3 className="text-lg font-semibold">{order.name}</h3>
              <p className="text-gray-600">Quantity: {order.count}</p>
              <p className="text-gray-600">Total Price: ${(order.price * order.count).toFixed(2)}</p>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default OrderPage;
