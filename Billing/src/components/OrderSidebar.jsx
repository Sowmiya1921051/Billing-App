import React, { useState, useRef } from 'react';
import axios from 'axios';
import { toPng } from 'html-to-image';

const OrderSidebar = ({ orders }) => {
  const [submitted, setSubmitted] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const orderListRef = useRef(null);

  // Function to capture the menu section as an image
  const handleCapture = async () => {
    if (orderListRef.current === null) {
      return;
    }
    const dataUrl = await toPng(orderListRef.current);
    setImageUrl(dataUrl);
    return dataUrl;
  };

  // Function to handle combined capture and submit actions
  const handleCombinedFunctions = async () => {
    const dataUrl = await handleCapture();
    return dataUrl;
  };

  // Function to handle order submission
  const handleSubmit = async () => {
    setSubmitted(true);
    try {
      const dataUrl = await handleCombinedFunctions();
      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], 'order.png', { type: 'image/png' });
      const formData = new FormData();
      formData.append('image', file);
      const response = await axios.post('http://localhost:5000/api/orderedList', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log('Image URL submitted:', dataUrl);
      console.log('Server response:', response.data);
    } catch (error) {
      console.error('Error submitting image URL:', error);
    }
  };

  return (
    <div className="w-64 bg-white shadow-lg p-4 fixed right-0 top-0 h-full overflow-y-auto">
      <h2 className="text-2xl font-bold mb-4">Your Orders</h2>
      <ul ref={orderListRef}>
        {Object.keys(orders).length === 0 ? (
          <p>No orders yet.</p>
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
      <button
        onClick={handleSubmit}
        className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
      >
        Submit Order
      </button>
      {submitted && (
        <p className="mt-4 text-green-600">Order submitted successfully!</p>
      )}
      <div className="text-center mt-5">
        {imageUrl && (
          <div>
            <p className="font-bold">Image URL:</p>
            <input
              type="text"
              className="mt-2 p-2 border border-gray-300 rounded w-full"
              value={imageUrl}
              readOnly
            />
            <img src={imageUrl} alt="Captured order" className="mt-4 border border-gray-300 rounded" />
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderSidebar;
