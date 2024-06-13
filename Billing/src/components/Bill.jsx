import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Bill = () => {
  const [orders, setOrders] = useState([]);
  const [tableOrders, setTableOrders] = useState([]);

  useEffect(() => {
    // Fetch orders
    axios.get('http://localhost:5000/api/orders')
      .then(response => {
        const completedOrders = response.data.filter(order => order.status === 'Completed');
        setOrders(completedOrders);
      })
      .catch(error => console.error('Error fetching orders:', error));

    // Fetch table orders
    axios.get('http://localhost:5000/api/tableOrders')
      .then(response => {
        const completedTableOrders = response.data.filter(tableOrder => tableOrder.status === 'Completed');
        setTableOrders(completedTableOrders);
      })
      .catch(error => console.error('Error fetching table orders:', error));
  }, []);

  // Function to calculate total price of items
  const calculateTotalPrice = (items) => {
    return items.reduce((total, item) => {
      const totalPrice = parseFloat(item.totalPrice || item.price);
      return Number.isNaN(totalPrice) ? total : total + totalPrice;
    }, 0);
  };

  // Function to calculate GST
  const calculateGST = (totalPrice) => {
    return totalPrice * 0.18; // Assuming GST rate of 18%
  };

  // Function to calculate total price with GST
  const calculateTotalWithGST = (items) => {
    const totalPrice = calculateTotalPrice(items);
    return (totalPrice + calculateGST(totalPrice)).toFixed(2);
  };

  // Function to handle printing
  const handlePrint = (containerId) => {
    const content = document.getElementById(containerId).innerHTML;
    const newWindow = window.open('', '_blank');
    newWindow.document.write(`
      <html>
        <head>
          <title>Print Preview</title>
          <style>
            body {
              font-family: 'Arial', sans-serif;
            }
            @media screen {
              .print-hidden {
                display: none;
              }
            }
            @media print {
              .print-only {
                display: block !important;
              }
              .screen-only {
                display: none;
              }
              body {
                background-color: #fff; /* Ensure white background for printing */
              }
            }
            .container {
              background-color: #ffffff;
              border-radius: 8px;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
              padding: 20px;
              max-width: 400px;
              margin: 0 auto;
            }
            h1 {
              font-size: 1.75rem;
              font-weight: bold;
              margin-bottom: 1rem;
              text-align: center;
            }
            p {
              font-size: 1rem;
              color: #4a5568;
              text-align: center;
            }
            .grid {
              display: grid;
              grid-template-columns: repeat(3, 1fr);
              gap: 1rem;
            }
            .mb-2 {
              margin-bottom: 0.5rem;
            }
          </style>
        </head>
        <body>
          <div class="container">
            ${content}
          </div>
        </body>
      </html>
    `);
    newWindow.document.close();
    newWindow.print();
  };

  // Function to handle canceling printing
  const handleCancelPrint = () => {
    // Close the print window
    window.close();
  };

  return (
    <div className="container mx-auto flex">
      {/* Left sidebar for navigation */}
      <div className="w-1/4 p-4">
        {/* Add navigation items here */}
      </div>

      {/* Right content for Orders and Table Orders */}
      <div className="w-3/4 p-4 flex space-x-8">
        <div className="mb-8 flex-1">
          <h1 className="text-3xl font-bold mb-4 text-center text-blue-600">Orders</h1>
          {orders.length > 0 ? (
            orders.map(order => (
              <div key={order._id} id={`order-${order._id}`} className="mb-6 mx-auto max-w-xs border rounded-lg overflow-hidden shadow-lg flex flex-col print-container" style={{ marginBottom: '1rem' }}>
                <div className="bg-blue-200 p-4 flex-1">
                  <div className="text-center mb-4">
                    <h1 className="text-3xl font-bold mb-2">Restaurant Name</h1>
                    <p>123 Main Street, City, Country</p>
                    <p>Contact: +123 456 7890</p>
                  </div>
                  <div className="border-b mb-4 pb-4">
                    <div className="grid grid-cols-3 gap-4 font-bold mb-2">
                      <span>Name</span>
                      <span>Quantity</span>
                      <span>Total Price</span>
                    </div>
                    {order.items && order.items.map(item => (
                      <div key={item.name} className="grid grid-cols-3 gap-4 mb-2">
                        <span>{item.name}</span>
                        <span>{item.count}</span>
                        <span>${item.price}</span>
                      </div>
                    ))}
                  </div>
                  <div className="text-right font-bold">
                    <p>Total Price: ${calculateTotalPrice(order.items)}</p>
                    <p>Total Price with GST: ${calculateTotalWithGST(order.items)}</p>
                  </div>
                  <div className="flex justify-end mt-4">
                    <button onClick={() => handlePrint(`order-${order._id}`)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mr-4 rounded print-button screen-only">
                      Bill
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No completed orders.</p>
          )}
        </div>

        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-4 text-center text-green-600">Table Orders</h1>
          {tableOrders.length > 0 ? (
            tableOrders.map(tableOrder => (
              <div key={tableOrder._id} id={`table-order-${tableOrder._id}`} className="mb-6 mx-auto max-w-xs border rounded-lg overflow-hidden shadow-lg flex flex-col print-container" style={{ marginBottom: '1rem' }}>
                <div className="bg-green-200 p-4 flex-1">
                  <div className="text-center mb-4">
                    <h1 className="text-3xl font-bold mb-2">Restaurant Name</h1>
                    <p>123 Main Street, City, Country</p>
                    <p>Contact: +123 456 7890</p>
                  </div>
                  <div className="text-center justify-evenly mb-4 flex">
                    <h1 className=" mb-2 font-semibold">Place: {tableOrder.place}</h1>
                    <p className=" mb-2 font-semibold">Table No: {tableOrder.tableNumber}</p>
                  </div>
                  <div className="border-b mb-4 pb-4">
                    <div className="grid grid-cols-3 gap-4 font-bold mb-2">
                      <span>Name</span>
                      <span>Quantity</span>
                      <span>Total Price</span>
                    </div>
                    {tableOrder.orders && tableOrder.orders.map(item => (
                      <div key={item.name} className="grid grid-cols-3 gap-4 mb-2">
                        <span>{item.name}</span>
                        <span>{item.quantity}</span>
                        <span>${item.totalPrice}</span>
                      </div>
                    ))}
                  </div>
                  <div className="text-right font-bold">
                    <p>Total Price: ${calculateTotalPrice(tableOrder.orders)}</p>
                    <p>Total Price with GST: ${calculateTotalWithGST(tableOrder.orders)}</p>
                  </div>
                  <div className="flex justify-end mt-4">
                    <button onClick={() => handlePrint(`table-order-${tableOrder._id}`)} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 mr-4 rounded print-button screen-only">
                      Bill
                    </button>
                    
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No completed table orders.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Bill;
