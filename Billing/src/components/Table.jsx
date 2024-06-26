import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Table() {
  const [popupContent, setPopupContent] = useState(null);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // Fetch orders from the API
    axios.get('http://localhost:5000/api/tableOrders')
      .then(response => {
        setOrders(response.data);
      })
      .catch(error => {
        console.error('Error fetching orders:', error);
      });
  }, []);

  const handleClick = (tableNumber, place) => {
    // Convert place to lowercase to match the data
    place = place.toLowerCase();

    // Filter orders based on table number, place, and status
    const tableOrders = orders.filter(order =>
      order.tableNumber === tableNumber &&
      order.place.toLowerCase() === place &&
      order.status === 'Pending'
    );

    if (tableOrders.length > 0) {
      // Generate popup content with table number, place, and orders
      const ordersList = tableOrders.map((order, index) => (
        <div key={index} className='text-center'>
          <div className="text-center mb-4">
            <h1 className="text-3xl font-bold mb-2">Restaurant Name</h1>
            <p>123 Main Street, City, Country</p>
            <p>Contact: +123 456 7890</p>
          </div>
          <p>{`Table ${tableNumber} - ${place.charAt(0).toUpperCase() + place.slice(1)}`}</p>
          <div className="grid grid-cols-3 gap-4 font-bold mb-2">
            <p className="col-span-2 text-center">Name</p>
            <p className="text-center">Quantity</p>
          </div>
          <ul>
            {order.orders.map((item, idx) => (
              <li key={idx} className="grid grid-cols-3 gap-4">
                <p className="col-span-2 text-center">{item.name}</p>
                <p className="text-center">{item.quantity}</p>
              </li>
            ))}
          </ul>
          <hr className="my-2" />
          <div className="flex justify-center">
            <svg className="h-6 w-6 text-red-600 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
            <p className="text-red-600 font-bold">Pending</p>
          </div>
        </div>
      ));

      setPopupContent(ordersList);
    } else {
      // No orders found
      setPopupContent([`No pending orders found for ${place} - Table ${tableNumber}`]);
    }
  };

  const closePopup = () => {
    setPopupContent(null);
  };

  return (
    <div className='flex'>
      {/* Navbar - Replace with actual navbar content */}
      <div className='w-1/4 h-screen'>
        Navbar
      </div>

      {/* Main content */}
      <div className='w-3/4 p-4'>
        {/* AC Room */}
        <div className='mb-8'>
          <h2 className='text-xl font-bold mb-4'>AC</h2>
          <div className='grid grid-cols-3 gap-4'>
            {Array.from({ length: 7 }).map((_, index) => (
              <div key={index} className='bg-blue-200 p-4 text-center cursor-pointer' onClick={() => handleClick(index + 1, 'AC')}>
                Table {index + 1}
              </div>
            ))}
          </div>
        </div>

        {/* Normal Room */}
        <div className='mb-8'>
          <h2 className='text-xl font-bold mb-4'>Dine in</h2>
          <div className='grid grid-cols-3 gap-4'>
            {Array.from({ length: 7 }).map((_, index) => (
              <div key={index} className='bg-green-200 p-4 text-center cursor-pointer' onClick={() => handleClick(index + 1, 'Dine in')}>
                Table {index + 1}
              </div>
            ))}
          </div>
        </div>

        {/* Round table */}
        <div>
          <h2 className='text-xl font-bold mb-4'>Round table</h2>
          <div className='grid grid-cols-3 gap-4'>
            {Array.from({ length: 7 }).map((_, index) => (
              <div key={index} className='bg-yellow-200 p-4 text-center cursor-pointer' onClick={() => handleClick(index + 1, 'Round table')}>
                Table {index + 1}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Popup */}
      {popupContent && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay */}
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            {/* Popup container */}
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
                    {/* Success icon */}
                    <svg className="h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    {/* Popup content */}
                    {popupContent.map((item, index) => (
                      <div key={index}>
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                {/* Close button */}
                <button onClick={closePopup} type="button" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm">
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Table;
