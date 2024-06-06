// src/AddDishForm.js
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const AddDishForm = () => {
  const [dishes, setDishes] = useState([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [subcategory, setsubCategory] = useState('');
  const [image, setImage] = useState(null);

  useEffect(() => {
    fetchDishes();
  }, []);

  const fetchDishes = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/dishes/all');
      setDishes(response.data);
    } catch (error) {
      console.error('Error fetching dishes:', error);
    }
  };

  const handleHideDish = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/dishes/${id}/hidden`, { hidden: true });
      fetchDishes(); // Refresh the dish list
    } catch (error) {
      console.error('Error hiding dish:', error);
    }
  };

  const handleUnhideDish = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/dishes/${id}/hidden`, { hidden: false });
      fetchDishes(); // Refresh the dish list
    } catch (error) {
      console.error('Error unhiding dish:', error);
    }
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    formData.append('originalPrice', price);
    formData.append('category', category);
    formData.append('subcategory', subcategory);
    formData.append('image', image);

    try {
      await axios.post('http://localhost:5000/api/dishes', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      alert('Dish added successfully');
      setName('');
      setPrice('');
      setCategory('');
      setsubCategory('');
      setImage(null);
      fetchDishes(); // Refresh the dish list
    } catch (error) {
      alert('Error adding dish');
      console.error('Axios error:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login'; // Navigate to login page
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* <Dashboard /> */}
      <div className="flex-1 bg-gray-100 flex flex-col items-center justify-center py-8">
        <div className="bg-white p-8 rounded shadow-md w-full max-w-md text-center">
          <h2 className="text-2xl mb-6">Add Dish</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-left">Name:</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border rounded px-2 py-1 w-full"
              />
            </div>
            <div>
              <label className="block text-left">Original Price:</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="border rounded px-2 py-1 w-full"
              />
            </div>
            <div>
              <label className="block text-left">Category:</label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="border rounded px-2 py-1 w-full"
              />
            </div>
            <div>
              <label className="block text-left">SubCategory:</label>
              <input
                type="text"
                value={subcategory}
                onChange={(e) => setsubCategory(e.target.value)}
                className="border rounded px-2 py-1 w-full"
              />
            </div>
            <div>
              <label className="block text-left">Image:</label>
              <input
                type="file"
                onChange={handleImageChange}
                className="border rounded px-2 py-1 w-full"
              />
            </div>
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded w-full">
              Add Dish
            </button>
          </form>
          <Link to="/adminComponent" className="bg-green-500 text-white px-4 py-2 rounded mt-4 block">
            View Orders
          </Link>
        </div>
        <button onClick={handleLogout} className="mt-4 bg-red-500 text-white px-4 py-2 rounded">
          Logout
        </button>

        <div className="mt-8 w-full max-w-3xl bg-white p-8 rounded shadow-md">
          <h2 className="text-2xl mb-6 text-center">Dish List</h2>
          <table className="min-w-full bg-white text-center">
            <thead>
              <tr>
                <th className="py-2">Name</th>
                <th className="py-2">Price</th>
                <th className="py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {dishes.map((dish) => (
                <tr key={dish._id} className="border-t">
                  <td className="py-2 px-4">{dish.name}</td>
                  <td className="py-2 px-4">${dish.priceWithGST.toFixed(2)}</td>
                  <td className="py-2 px-4">
                    {dish.hidden ? (
                      <button
                        onClick={() => handleUnhideDish(dish._id)}
                        className="bg-green-500 text-white px-4 py-2 rounded"
                      >
                        Unhide
                      </button>
                    ) : (
                      <button
                        onClick={() => handleHideDish(dish._id)}
                        className="bg-red-500 text-white px-4 py-2 rounded"
                      >
                        Hide
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AddDishForm;
