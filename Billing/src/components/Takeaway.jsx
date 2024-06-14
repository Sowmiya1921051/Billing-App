import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';

function Takeaway() {
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
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDishes, setSelectedDishes] = useState({});
  const [orderDetails, setOrderDetails] = useState(null);

  const fetchDishes = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('http://localhost:5000/api/dishes', { timeout: 10000 }); // 10 seconds timeout
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
      const searchMatch = dish.name.toLowerCase().includes(searchTerm.toLowerCase());
      return categoryMatch && subcategoryMatch && searchMatch;
    });
  }, [dishes, selectedCategory, selectedType, searchTerm]);

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

  const handleCheckboxChange = (id) => {
    setSelectedDishes(prevSelectedDishes => ({
      ...prevSelectedDishes,
      [id]: !prevSelectedDishes[id]
    }));
  };

  const handleOrder = async () => {
    const selectedOrderDetails = Object.keys(selectedDishes).filter(id => selectedDishes[id]).map(id => ({
      id,
      name: dishes.find(dish => dish._id === id).name,
      count: orders[id]?.count || 0,
      price: prices[id]
    }));
    const totalPrice = selectedOrderDetails.reduce((sum, { count, price }) => sum + (count * price), 0);
    
    const order = { items: selectedOrderDetails, totalPrice };
    
    try {
      const response = await axios.post('http://localhost:5000/api/orders', order);
      console.log('Order saved:', response.data);
      setOrderDetails({ items: selectedOrderDetails, totalPrice });
    } catch (error) {
      console.error('Error saving order:', error);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center">{error}</div>;
  }

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <nav className="w-64 text-white flex-shrink-0">
        {/* Your sidebar content goes here */}
      </nav>

      {/* Main Content */}
      <div className="flex flex-col flex-grow bg-gray-100 relative">
        <div className="flex-grow overflow-y-auto pb-24">
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-3xl font-bold">{categoryTitle}</h2>
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-4 py-2 border rounded-lg"
              />
            </div>
            <ul className="w-full space-y-4">
              {filteredDishes.map(dish => (
                <li key={dish._id} className="bg-white rounded-lg shadow-md p-4 flex items-center">
                  <input
                    type="checkbox"
                    checked={!!selectedDishes[dish._id]}
                    onChange={() => handleCheckboxChange(dish._id)}
                    className="mr-4"
                  />
                  <div className="flex-grow">
                    <h3 className="text-xl font-semibold">{dish.name}</h3>
                    <p className="text-gray-600">Price: ${prices[dish._id].toFixed(2)}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button onClick={() => handleIncreasePrice(dish._id)} className="text-green-500 px-2 py-1 text-2xl font-bold">+</button>
                    <button onClick={() => handleDecreasePrice(dish._id)} className="text-blue-500 px-2 py-1 text-2xl font-bold">-</button>
                  </div>
                  <span className="text-xl text-red-600 text-center font-bold ml-4">{counters[dish._id]}</span>
                </li>
              ))}
            </ul>
          </main>
        </div>

        {/* Bottom Order Section */}
        <div className="bg-white shadow-md p-4 fixed bottom-0 left-64 right-0">
          <div className="flex justify-between items-center">
            <button
              onClick={handleOrder}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg"
            >
              Order
            </button>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input type="radio" name="paymentMethod" value="cash" className="mr-2" />
                Cash
              </label>
              <label className="flex items-center">
                <input type="radio" name="paymentMethod" value="upi" className="mr-2" />
                UPI
              </label>
            </div>
          </div>
        </div>

        {/* Order Details Section */}
        {orderDetails && (
          <div className="bg-gray-100 p-4 fixed bottom-0 right-0 w-1/3 shadow-md">
            <h3 className="text-xl font-bold mb-4">Order Details</h3>
            <ul className="space-y-2">
              {orderDetails.items.map(({ id, name, count, price }) => (
                <li key={id} className="flex justify-between items-center">
                  <span>{name}</span>
                  <span>{count} x ${price.toFixed(2)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 text-lg font-bold">
              Total: ${orderDetails.totalPrice.toFixed(2)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Takeaway;
