import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Table() {
  const [popupText, setPopupText] = useState([]);
  const [orders, setOrders] = useState([]);
  
  useEffect(() => {
    // Fetch orders from the API
    axios.get('http://localhost:5000/api/tableorders')
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
      // Generate popup text with table number, place, and orders
      const popupContent = tableOrders.map((order, index) => (
        <div key={index}>
          <p>{` Table ${tableNumber} - ${place.charAt(0).toUpperCase() + place.slice(1)}`}</p>
          <ul>
            {order.orders.map((item, idx) => (
              <li key={idx}>{`${item.quantity} - ${item.name}`}</li>
            ))}
          </ul>
        </div>
      ));
      setPopupText(popupContent);
    } else {
      // No orders found
      setPopupText([`No pending orders found for ${place} - Table ${tableNumber}`]);
    }
  };
  
  return (
    <div className='flex'>
      {/* Navbar */}
      <div className='w-1/4 h-screen '>
        Navbar
      </div>

      {/* Main content */}
      <div className='w-3/4 p-4'>
        {/* AC Room */}
        <div className='mb-8'>
          <h2 className='text-xl font-bold mb-4'>AC</h2>
          <div className='grid grid-cols-3 gap-4'>
            {Array.from({ length: 7 }).map((_, index) => (
              <div key={index} className='bg-blue-200 p-4 text-center' onClick={() => handleClick(index + 1, 'AC')}>
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
              <div key={index} className='bg-green-200 p-4 text-center' onClick={() => handleClick(index + 1, 'Dine in')}>
                Table {index + 1}
              </div>
            ))}
          </div>
        </div>

        {/* Dine */}
        <div>
          <h2 className='text-xl font-bold mb-4'>Round table</h2>
          <div className='grid grid-cols-3 gap-4'>
            {Array.from({ length: 7 }).map((_, index) => (
              <div key={index} className='bg-yellow-200 p-4 text-center' onClick={() => handleClick(index + 1, 'Round table')}>
                Table {index + 1}
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Popup */}
      {popupText.length > 0 && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
                    {/* Heroicon name: outline/check */}
                    <svg className="h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    {popupText.map((item, index) => (
                      <div key={index}>
                        {item}
                        <hr className="my-2" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button onClick={() => setPopupText([])} type="button" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm">
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
