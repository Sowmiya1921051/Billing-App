import React, { useState, useRef } from 'react';
import axios from 'axios';
import { toPng } from 'html-to-image';

// eslint-disable-next-line react/prop-types, no-unused-vars
const OrderSidebar = ({ orders, fetchDishes, tableNumber, place, setTableNumber, setPlace }) => {
  const [submitted, setSubmitted] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const orderTableRef = useRef(null);

  const handleCapture = async () => {
    if (orderTableRef.current === null) {
      return;
    }
    const dataUrl = await toPng(orderTableRef.current);
    setImageUrl(dataUrl);
    return dataUrl;
  };

  const handleCombinedFunctions = async () => {
    const dataUrl = await handleCapture();
    return dataUrl;
  };

  const handleSubmit = async () => {
    setSubmitted(true);
    try {
      const dataUrl = await handleCombinedFunctions();
      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], 'order.png', { type: 'image/png' });

      const orderDetails = Object.entries(orders).map(([id, order]) => ({
        name: order.name,
        quantity: order.count,
        totalPrice: (order.price * order.count).toFixed(2),
        gstPrice: ((order.price * order.count) * 0.18).toFixed(2) // Assuming GST rate is 18%
      }));

      const formData = new FormData();
      formData.append('image', file);
      formData.append('orders', JSON.stringify(orderDetails));
      formData.append('tableNumber', tableNumber);
      formData.append('place', place);
      formData.append('status', 'Pending');

      const formResponse = await axios.post('http://localhost:5000/api/orderedList', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      console.log('Image URL and orders submitted:', dataUrl);
      console.log('Server response (form):', formResponse.data);

      const orderData = {
        orders: orderDetails,
        tableNumber: tableNumber,
        place: place,
        status :'Pending'
      };

      const orderResponse = await axios.post('http://localhost:5000/api/tableOrders', orderData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log('Orders submitted:', orderData);
      console.log('Server response (orders):', orderResponse.data);

      fetchDishes(); // Fetch the latest dishes after successful submission
    } catch (error) {
      console.error('Error submitting image URL and orders:', error);
    }
  };

  // Calculate total price without GST
  const calculateTotalPrice = () => {
    let totalPrice = 0;
    Object.values(orders).forEach(order => {
      totalPrice += order.price * order.count;
    });
    return totalPrice.toFixed(2);
  };

  // Calculate total price with GST
  const calculateTotalPriceWithGST = () => {
    const totalPrice = parseFloat(calculateTotalPrice());
    // Assuming GST rate is 18%
    const gstRate = 0.18;
    const totalPriceWithGST = totalPrice * (1 + gstRate);
    return totalPriceWithGST.toFixed(2);
  };

  return (
    <div className="order-sidebar bg-white shadow-lg p-4 top-0 right-0 bottom-0 overflow-y-auto">
      <h2 className="text-2xl font-bold mb-4">Your Orders</h2>
      {/* <div className="mb-4">
        <label htmlFor="tableNumber" className="block text-sm font-medium text-gray-700">Table Number</label>
        <select
          id="tableNumber"
          value={tableNumber}
          onChange={(e) => setTableNumber(parseInt(e.target.value))}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        >
          {[...Array(7)].map((_, i) => (
            <option key={i + 1} value={i + 1}>{i + 1}</option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label htmlFor="place" className="block text-sm font-medium text-gray-700">Place</label>
        <select
          id="place"
          value={place}
          onChange={(e) => setPlace(e.target.value)}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        >
          <option value="AC">AC</option>
          <option value="Dine In">Dine In</option>
          <option value="Round Table">Round Table</option>
        </select>
      </div> */}
      <div ref={orderTableRef}>
        <div className="mb-4 text-center">
          <h3 className="text-xl font-bold">Restaurant Name</h3>
          <p>123 Main Street, City, Country</p>
          <p>Contact: +123 456 7890</p>
        </div>
        <table className="w-full">
          <thead>
            <tr>
              <th>Name</th>
              <th>Quantity</th>
              <th>Total Price</th>
              {/* <th>GST Price</th> */}
            </tr>
          </thead>
          <tbody>
            {Object.keys(orders).length === 0 ? (
              <tr>
                <td colSpan="4">No orders yet.</td>
              </tr>
            ) : (
              Object.entries(orders).map(([id, order]) => (
                <tr key={id} className='text-center'>
                  <td>{order.name}</td>
                  <td>{order.count}</td>
                  <td>${(order.price * order.count).toFixed(2)}</td>
                  {/* <td>${((order.price * order.count) * 0.18).toFixed(2)}</td> */}
                </tr>
              ))
            )}
          </tbody>
        </table>
        <div className="mt-4 text-center">
          <p className="font-semibold">Total Price: ${calculateTotalPrice()}</p>
          <p className="font-semibold">Total Price with GST: ${calculateTotalPriceWithGST()}</p>
        </div>
      </div>
      <button
        onClick={handleSubmit}
        className="bg-blue-500 text-white  px-4 py-2 rounded mt-4"
      >
        Submit Order
      </button>
      {submitted && (
        <p className="mt-4 text-green-600">Order submitted successfully!</p>
      )}
      {/* <div className="text-center mt-5">
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
      </div> */}
    </div>
  );
};

export default OrderSidebar;
