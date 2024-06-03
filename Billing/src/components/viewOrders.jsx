import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import OrderSidebar from './OrderSidebar';
import Category from './Category';
import Dashboard from './Dashboard';

function DishList() {
  const [dishes, setDishes] = useState([]);
  const [prices, setPrices] = useState({});
  const [originalPrices, setOriginalPrices] = useState({});
  const [counters, setCounters] = useState({});
  const [orders, setOrders] = useState({});
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [categoryTitle, setCategoryTitle] = useState('Dishes');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching dishes:', error);
        setError('Error fetching dishes');
        setLoading(false);
      });
  }, []);

  const filteredDishes = useMemo(() => {
    return dishes.filter(dish => {
      const categoryMatch = selectedCategory === 'all' || (dish.category && dish.category.toLowerCase().split(',').includes(selectedCategory.toLowerCase()));
      const subcategoryMatch = selectedType === 'all' || (dish.subcategory && dish.subcategory.toLowerCase().split(',').includes(selectedType.toLowerCase()));
      return categoryMatch && subcategoryMatch;
    });
  }, [dishes, selectedCategory, selectedType]);

  useEffect(() => {
    setCategoryTitle(selectedCategory === 'all' ? 'Dishes' : selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1));
  }, [selectedCategory]);

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

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <div className="flex-shrink-0 fixed top-0 left-0 h-full">
        <Dashboard />
      </div>
      <div className="flex-grow ml-64 overflow-y-auto">
        <Category setSelectedCategory={setSelectedCategory} setSelectedType={setSelectedType} />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h2 className="text-3xl font-bold my-8">{categoryTitle}</h2>
            <ul className="w-full max-w-4xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDishes.map(dish => (
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
      </div>
      <div className="flex-shrink-0 fixed top-0 right-0 h-full w-64">
        <OrderSidebar orders={orders} />
      </div>
    </div>
  );
}

export default DishList;
