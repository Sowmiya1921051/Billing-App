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
  const [editingPriceId, setEditingPriceId] = useState(null);
  const [newPrice, setNewPrice] = useState('');

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

  const handleEditPrice = (id, currentPrice) => {
    setEditingPriceId(id);
    setNewPrice(currentPrice);
  };

  const handleSavePrice = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/dishes/${id}/price`, { price: newPrice });
      setEditingPriceId(null);
      setNewPrice('');
      fetchDishes(); // Refresh the dish list
    } catch (error) {
      console.error('Error updating price:', error);
    }
  };

  const handleCancelEdit = () => {
    setEditingPriceId(null);
    setNewPrice('');
  };

  return (
    <div className="min-h-screen flex">
      {/* Left-side navigation bar */}
      <nav className="w-64 text-white p-6">
        {/* Add your navigation items here */}
      </nav>

      {/* Right-side content */}
      <div className="flex-1 bg-gray-100 flex flex-col items-center justify-center py-8">
        <div className="w-full max-w-3xl">
          <div className="bg-white p-8 rounded-3xl shadow-xl border-l-4 border-r-4 border-indigo-700 mb-8 text-center">
            <h2 className="text-2xl mb-6">Add Dish</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-left">Name:</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="border-b focus:outline-none px-2 py-1 w-full"
                />
              </div>
              <div>
                <label className="block text-left">Original Price:</label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="border-b focus:outline-none px-2 py-1 w-full"
                />
              </div>
              <div>
                <label className="block text-left">Category:</label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="border-b focus:outline-none px-2 py-1 w-full"
                />
              </div>
              <div>
                <label className="block text-left">SubCategory:</label>
                <input
                  type="text"
                  value={subcategory}
                  onChange={(e) => setsubCategory(e.target.value)}
                  className="border-b focus:outline-none px-2 py-1 w-full"
                />
              </div>
              <div>
                <label className="block text-left">Image:</label>
                <input
                  type="file"
                  onChange={handleImageChange}
                  className="border-b focus:outline-none px-2 py-1 w-full"
                />
              </div>
              <button type="submit" className="bg-indigo-500 text-white px-4 py-2 rounded w-80">
                Add Dish
              </button>
            </form>
            <Link
              to="/adminComponent"
              className="mx-auto bg-green-500 text-white px-4 py-2 rounded mt-4 text-center block w-80"
            >
              View Orders
            </Link>
          </div>
          <button
            onClick={handleLogout}
            className="mx-auto mt-10 bg-indigo-500 text-xl text-center text-white px-4 py-2 rounded-full block"
          >
            Logout
          </button>
          <div className="bg-white p-8 rounded-xl shadow-md w-full mt-12">
            <h2 className="text-4xl mb-6 text-center font-semibold">Dish List</h2>
            <table className="min-w-full bg-white text-center">
              <thead>
                <tr className="text-xl">
                  <th className="py-2">Name</th>
                  <th className="py-2">Price</th>
                  <th className="py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {dishes.map((dish, index) => (
                  <tr key={dish._id} className={`border-t ${index % 2 === 0 ? 'bg-white' : 'bg-gray-100'}`}>
                    <td className="py-2 px-4">{dish.name}</td>
                    <td className="py-2 px-4">
                      {editingPriceId === dish._id ? (
                        <>
                          <input
                            type="number"
                            value={newPrice}
                            onChange={(e) => setNewPrice(e.target.value)}
                            className="border-b focus:outline-none px-2 py-1 w-20"
                          />
                          <button
                            onClick={() => handleSavePrice(dish._id)}
                            className="bg-blue-500 text-white px-2 py-1 rounded ml-2"
                          >
                            Save
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="bg-gray-500 text-white px-2 py-1 rounded ml-2"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          ${dish.originalPrice.toFixed(2)}
                          <button
                            onClick={() => handleEditPrice(dish._id, dish.originalPrice)}
                            className="bg-yellow-500 text-white px-2 py-1 rounded ml-2"
                          >
                            Edit
                          </button>
                        </>
                      )}
                    </td>
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
    </div>
  );
};

export default AddDishForm;
