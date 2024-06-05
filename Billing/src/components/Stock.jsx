import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Stock = () => {
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDishes();
  }, []);

  const fetchDishes = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/dishes/all');
      setDishes(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dishes:', error);
      setError('Error fetching dishes');
      setLoading(false);
    }
  };

  const handleOrder = async (id, orderedQuantity) => {
    try {
      const dish = dishes.find(d => d._id === id);
      if (dish && dish.stock >= orderedQuantity) {
        const updatedStock = dish.stock - orderedQuantity;
        await axios.put(`http://localhost:5000/api/dishes/${id}`, { stock: updatedStock });
        fetchDishes(); // Refresh the dish list
      } else {
        alert('Not enough stock');
      }
    } catch (error) {
      console.error('Error updating stock:', error);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8 w-full">
      <h2 className="text-2xl mb-6 text-center">Dish Stock</h2>
      <table className="min-w-full bg-white text-center">
        <thead>
          <tr>
            <th className="py-2">Name</th>
            <th className="py-2">Price</th>
            <th className="py-2">Stock</th>
            <th className="py-2">Order</th>
          </tr>
        </thead>
        <tbody>
          {dishes.map((dish) => (
            <tr key={dish._id} className="border-t">
              <td className="py-2 px-4">{dish.name}</td>
              <td className="py-2 px-4">${dish.priceWithGST.toFixed(2)}</td>
              <td className="py-2 px-4">{dish.stock}</td>
              <td className="py-2 px-4">
                <button
                  onClick={() => handleOrder(dish._id, 1)} // assuming ordering 1 at a time
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Order 1
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Stock;
