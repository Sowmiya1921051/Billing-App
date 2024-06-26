import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import LazyLoad from 'react-lazyload';
import Category from './Category';
import Dashboard from './Dashboard';
import OrderSidebar from './OrderSidebar';

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
  const [tableNumber, setTableNumber] = useState(1);
  const [place, setPlace] = useState('AC');

  const fetchDishes = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('http://localhost:5000/api/dishes', { timeout: 1000 }); // 10 seconds timeout
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
    } catch (error) {
      console.error('Error fetching dishes:', error);
      setError('Error fetching dishes. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDishes();
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

  // const handleLogout = () => {
  //   localStorage.removeItem('token');
  //   window.location.href = '/login';
  // };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex overflow-x-hidden">
      <Dashboard />
      <div className="flex-grow ml-16 md:ml-64 min-w-0 overflow-y-auto">
        <Category setSelectedCategory={setSelectedCategory} setSelectedType={setSelectedType} />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h2 className="text-3xl font-bold my-8">{categoryTitle}</h2>

            <div className="flex flex-col items-center mb-8">
              <div className="mb-4">
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
              </div>
            </div>

            <div className="flex justify-center">
              <ul className="w-full max-w-4xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDishes.map(dish => (
                  <li key={dish._id} className="bg-white rounded-lg shadow-md p-4">
                    <LazyLoad height={200} offset={100} placeholder={<div className="w-full h-48 bg-gray-200 animate-pulse"></div>}>
                      {dish.imageUrl && <img src={`http://localhost:5000/${dish.imageUrl}`} alt={dish.name} className="w-full h-48 object-cover rounded-t-lg" />}
                    </LazyLoad>
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
          </div>
        </main>
      </div>
      
      <OrderSidebar orders={orders} fetchDishes={fetchDishes} tableNumber={tableNumber} place={place} setTableNumber={setTableNumber} setPlace={setPlace} />
      
    </div>
  );
}

export default DishList;