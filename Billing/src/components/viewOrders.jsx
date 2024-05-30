import { useState, useEffect } from 'react';
import axios from 'axios';
import OrderSidebar from './OrderSidebar';
import { Link } from 'react-router-dom';
import Category from './Category';


function DishList() {
  const [dishes, setDishes] = useState([]);
  const [prices, setPrices] = useState({});
  const [originalPrices, setOriginalPrices] = useState({});
  const [counters, setCounters] = useState({});
  const [orders, setOrders] = useState({});
  

  useEffect(() => {
    axios.get('http://localhost:5000/api/dishes')
      .then(response => {
        const fetchedDishes = response.data;
        setDishes(fetchedDishes); 

        const initialPrices = {};
        const initialOriginalPrices = {};
        const initialCounters = {};
        fetchedDishes.forEach(dish => {
          initialPrices[dish._id] = dish.originalPrice;
          initialOriginalPrices[dish._id] = dish.originalPrice;
          initialCounters[dish._id] = 0;
        });
        setPrices(initialPrices);
        setOriginalPrices(initialOriginalPrices);
        setCounters(initialCounters);
      })
      .catch(error => {
        console.error('Error fetching dishes:', error);
      });
  }, []); 

  const handleIncreasePrice = (id) => {
    setPrices(prevPrices => ({
      ...prevPrices,
      [id]: prevPrices[id] 
    }));
    setCounters(prevCounters => ({
      ...prevCounters,
      [id]: prevCounters[id] + 1
    }));
    setOrders(prevOrders => ({
      ...prevOrders,
      [id]: {
        name: dishes.find(dish => dish._id === id).name,
        count: (prevOrders[id]?.count || 0) + 1,
        price: originalPrices[id]
      }
    }));
  };

  const handleDecreasePrice = (id) => {
    setPrices(prevPrices => ({
      ...prevPrices,
      [id]: prevPrices[id] > originalPrices[id] ? prevPrices[id] / 2 : prevPrices[id]
    }));
    setCounters(prevCounters => ({
      ...prevCounters,
      [id]: prevCounters[id] > 0 ? prevCounters[id] - 1 : 0
    }));
    setOrders(prevOrders => {
      const newOrders = { ...prevOrders };
      if (newOrders[id]?.count > 1) {
        newOrders[id].count -= 1;
      } else {
        delete newOrders[id];
      }
      return newOrders;
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login'; 
  };
  
  return (
    <div className="min-h-screen bg-gray-100">
  
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
             <Link className='mt-4' to='/menulist'>MenuList</Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:items-center">
          
              <button onClick={handleLogout} className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <Category/>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-6">
          <h2 className="text-3xl font-bold my-8">Dishes</h2>
          <ul className="w-full max-w-4xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {dishes.map(dish => (
              <li key={dish._id} className="bg-white rounded-lg shadow-md p-4">
                {dish.imageUrl && <img src={`http://localhost:5000/${dish.imageUrl}`} alt={dish.name} className="w-full h-48 object-cover rounded-t-lg" />}
                <div className="p-4">
                  <h3 className="text-xl font-semibold">{dish.name}</h3>
                  <p className="text-gray-600">Price: ${prices[dish._id].toFixed(2)}</p>
                  <div className="flex justify-between items-center mt-2">
                    <div className="flex space-x-2">
                      <button onClick={() => handleIncreasePrice(dish._id)} className="text-green-500 px-2 py-1 text-2xl font-bold">+</button>
                      <button onClick={() => handleDecreasePrice(dish._id)} className="text-blue-500 px-2 py-1 text-2xl font-bold">-</button>
                    </div>
                    <span className="text-xl text-red-600 text-center font-bold">{counters[dish._id]}</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </main>

      <OrderSidebar orders={orders} />
    </div>
  );
}

export default DishList;

