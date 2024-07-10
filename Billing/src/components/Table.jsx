import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Table() {
  const [popupContent, setPopupContent] = useState(null);
  const [orders, setOrders] = useState([]);
  const [orderDetails, setOrderDetails] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [remainingBalance, setRemainingBalance] = useState(null);

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
    place = place.toLowerCase();

    const tableOrders = orders.filter(order =>
      order.tableNumber === tableNumber &&
      order.place.toLowerCase() === place &&
      order.status === 'Pending'
    );

    if (tableOrders.length > 0) {
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
      calculateOrderDetails(tableOrders);
    } else {
      setPopupContent([`Order Details\nNo pending orders found for ${place} - Table ${tableNumber}`]);
      setOrderDetails(null); // Reset order details if no pending orders
    }
  };

  const calculateOrderDetails = (tableOrders) => {
    const selectedOrderDetails = tableOrders.map(order => ({
      id: order._id,
      name: order.orders.map(item => item.name).join(', '),
      count: order.orders.reduce((acc, item) => acc + item.quantity, 0),
      totalPrice: order.orders.reduce((acc, item) => acc + parseFloat(item.totalPrice), 0),
      gstPrice: order.orders.reduce((acc, item) => acc + parseFloat(item.gstPrice), 0)
    }));
    const totalPrice = selectedOrderDetails.reduce((sum, { totalPrice }) => sum + totalPrice, 0);
    const totalGstPrice = selectedOrderDetails.reduce((sum, { gstPrice }) => sum + gstPrice, 0);
    const totalPriceWithGST = totalPrice + totalGstPrice;

    setOrderDetails({ items: selectedOrderDetails, totalPrice, totalGstPrice, totalPriceWithGST });
  };

  const handleCashPayment = () => {
    const enteredAmount = parseFloat(paymentAmount);
    if (!isNaN(enteredAmount) && orderDetails) {
      const remainingBalance = enteredAmount - orderDetails.totalPriceWithGST;
      setRemainingBalance(remainingBalance);
    }
  };

  const handleGPayPayment = () => {
    alert('GPay payment method selected.');
    // Implement GPay payment logic here
  };

  const handlePrintBill = () => {
    const restaurantInfo = {
      name: "Restaurant Name",
      address: "123 Main Street, City, Country",
      contact: "+123 456 7890"
    };

    const printWindow = window.open('', '_blank');
    const printDocument = printWindow.document.open();
    const billHtml = `
      <html>
        <head>
          <title>Order Bill</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h3 { font-size: 24px; }
            p { margin: 5px 0; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { padding: 8px; text-align: center; }
            th { background-color: #f4f4f4; }
          </style>
        </head>
        <body>
          <h3>${restaurantInfo.name}</h3>
          <p>${restaurantInfo.address}</p>
          <p>Contact: ${restaurantInfo.contact}</p>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Quantity</th>
                <th>Total Price</th>
              </tr>
            </thead>
            <tbody>
              ${orderDetails.items.map(({ name, count, totalPrice }) => `
                <tr>
                  <td>${name.split(', ').join('</td></tr><tr><td>')}</td>
                  <td>${count}</td>
                  <td>$${totalPrice.toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="3"><strong>Total Price:</strong> $${orderDetails.totalPrice.toFixed(2)}</td>
              </tr>
              <tr>
                <td colspan="3"><strong>GST Price:</strong> $${orderDetails.totalGstPrice.toFixed(2)}</td>
              </tr>
              <tr>
                <td colspan="3"><strong>Total Price with GST:</strong> $${orderDetails.totalPriceWithGST.toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>
        </body>
      </html>
    `;
    printDocument.write(billHtml);
    printDocument.close();
    printWindow.print();
  };

  const closePopup = () => {
    setPopupContent(null);
  };

  const hasPendingOrders = (tableNumber, place) => {
    return orders.some(order =>
      order.tableNumber === tableNumber &&
      order.place.toLowerCase() === place.toLowerCase() &&
      order.status === 'Pending'
    );
  };

  const getNotificationColor = (place) => {
    switch (place.toLowerCase()) {
      case 'ac':
        return 'bg-blue-500';
      case 'dine in':
        return 'bg-green-500';
      case 'round table':
        return 'bg-yellow-500';
      default:
        return 'bg-red-500';
    }
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
              <div key={index} className='relative bg-blue-200 p-4 text-center cursor-pointer' onClick={() => handleClick(index + 1, 'AC')}>
                Table {index + 1}
                {hasPendingOrders(index + 1, 'AC') && <span className={`absolute top-0 right-0 h-3 w-3 ${getNotificationColor('AC')} rounded-full`}></span>}
              </div>
            ))}
          </div>
        </div>

        {/* Dine-in Room */}
        <div className='mb-8'>
          <h2 className='text-xl font-bold mb-4'>Dine in</h2>
          <div className='grid grid-cols-3 gap-4'>
            {Array.from({ length: 7 }).map((_, index) => (
              <div key={index} className='relative bg-green-200 p-4 text-center cursor-pointer' onClick={() => handleClick(index + 1, 'Dine in')}>
                Table {index + 1}
                {hasPendingOrders(index + 1, 'Dine in') && <span className={`absolute top-0 right-0 h-3 w-3 ${getNotificationColor('Dine in')} rounded-full`}></span>}
              </div>
            ))}
          </div>
        </div>

        {/* Round Table */}
        <div className='mb-8'>
          <h2 className='text-xl font-bold mb-4'>Round Table</h2>
          <div className='grid grid-cols-3 gap-4'>
            {Array.from({ length: 7 }).map((_, index) => (
              <div key={index} className='relative bg-yellow-200 p-4 text-center cursor-pointer' onClick={() => handleClick(index + 1, 'Round Table')}>
                Table {index + 1}
                {hasPendingOrders(index + 1, 'Round Table') && <span className={`absolute top-0 right-0 h-3 w-3 ${getNotificationColor('Round Table')} rounded-full`}></span>}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Popup modal */}
      {popupContent && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
          <div className="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full">
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  {popupContent}
                  {orderDetails && (
                    <div>
                      <p>Total Price: ${orderDetails.totalPrice.toFixed(2)}</p>
                      <p>GST Price: ${orderDetails.totalGstPrice.toFixed(2)}</p>
                      <p>Total Price with GST: ${orderDetails.totalPriceWithGST.toFixed(2)}</p>
                      {orders.length > 0 && (
                        <>
                          <input
                            type="number"
                            placeholder="Enter cash amount"
                            value={paymentAmount}
                            onChange={(e) => setPaymentAmount(e.target.value)}
                            className="mt-2 px-4 py-2 border rounded-md"
                          />
                          <div className="flex space-x-2 mt-2">
                            <button
                              className="px-4 py-2 bg-green-500 text-white rounded-md"
                              onClick={handleCashPayment}
                            >
                              Cash
                            </button>
                            <button
                              className="px-4 py-2 bg-blue-500 text-white rounded-md"
                              onClick={handleGPayPayment}
                            >
                              GPay
                            </button>
                            <button
                              className="px-4 py-2 bg-gray-500 text-white rounded-md"
                              onClick={handlePrintBill}
                            >
                              Print Bill
                            </button>
                          </div>
                          {remainingBalance !== null && (
                            <p>Remaining Balance: ${remainingBalance.toFixed(2)}</p>
                          )}
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="button"
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                onClick={closePopup}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Table;
