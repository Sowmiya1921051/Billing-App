import React, { useState, useEffect } from 'react';
import axios from 'axios';

const StockManagementComponent = () => {
  const [newStock, setNewStock] = useState({ name: '', price: 0, weight: 0 });
  const [stocks, setStocks] = useState([]);
  const [editingStockId, setEditingStockId] = useState(null);
  const [editingPrice, setEditingPrice] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [listSuccess, setListSuccess] = useState(null);  // New state for success message in stock list

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/stock');
        setStocks(response.data);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchStocks();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewStock({ ...newStock, [name]: value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/stock', newStock);
      setSuccess('Stock added successfully!');
      setError(null);
      setNewStock({ name: '', price: 0, weight: 0 });
      setStocks([...stocks, response.data]);
    } catch (error) {
      setError(error.message);
      setSuccess(null);
    }
  };

  const handleEditClick = (stock) => {
    setEditingStockId(stock._id);
    setEditingPrice(stock.price);
  };

  const handlePriceChange = (e) => {
    setEditingPrice(e.target.value);
  };

  const handleSaveClick = async (id) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/stock/${id}`, { price: editingPrice });
      const updatedStocks = stocks.map((stock) => (stock._id === id ? response.data : stock));
      setStocks(updatedStocks);
      setEditingStockId(null);
      setListSuccess('Stock price updated successfully!');  // Set success message for stock list
      setError(null);
    } catch (error) {
      setError(error.message);
      setListSuccess(null);
    }
  };

  const handleCancelClick = () => {
    setEditingStockId(null);
  };

  return (
    <div className="p-4">
      <div className="max-w-sm mx-auto bg-white shadow-md rounded-lg overflow-hidden mb-8">
        <form onSubmit={handleFormSubmit} className="p-4">
          <h3 className="text-lg font-semibold text-gray-800">Add New Stock</h3>
          {error && <p className="text-red-500">{error}</p>}
          {success && <p className="text-green-500">{success}</p>}
          <div className="mb-4">
            <label className="block text-gray-600">Name</label>
            <input
              type="text"
              name="name"
              value={newStock.name}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-600">Price</label>
            <input
              type="number"
              name="price"
              value={newStock.price}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-600">Weight</label>
            <input
              type="number"
              name="weight"
              value={newStock.weight}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <button type="submit" className="w-full p-2 border-2 border-blue-500 text-blue-500 rounded hover:bg-blue-50">
            Add Stock
          </button>
        </form>
      </div>

      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Stock List</h2>
        {error && <p className="text-red-500">{error}</p>}
        {listSuccess && <p className="text-green-500">{listSuccess}</p>}  {/* Display success message for stock list */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 bg-gray-200 text-gray-800 font-semibold">Name</th>
                <th className="py-2 px-4 bg-gray-200 text-gray-800 font-semibold">Price</th>
                <th className="py-2 px-4 bg-gray-200 text-gray-800 font-semibold">Weight</th>
                <th className="py-2 px-4 bg-gray-200 text-gray-800 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {stocks.map((stock) => (
                <tr key={stock._id} className="border-t border-gray-200 text-center ">
                  <td className="py-2 px-4">{stock.name}</td>
                  <td className="py-2 px-4">
                    {editingStockId === stock._id ? (
                      <input
                        type="number"
                        value={editingPrice}
                        onChange={handlePriceChange}
                        className="w-full p-2 border border-gray-300 rounded"
                      />
                    ) : (
                      `$${stock.price.toFixed(2)}`
                    )}
                  </td>
                  <td className="py-2 px-4">{stock.weight}</td>
                  <td className="py-2 px-4">
                    {editingStockId === stock._id ? (
                      <>
                        <button
                          onClick={() => handleSaveClick(stock._id)}
                          className="mr-2 w-16  p-2 border-2 border-green-500 text-green-500 rounded hover:bg-green-50"
                        >
                          Save
                        </button>
                        <button
                          onClick={handleCancelClick}
                          className="p-2 border-2 w-16 border-red-500 text-red-500 rounded hover:bg-red-50"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => handleEditClick(stock)}
                        className="p-2 border-2 w-16 border-blue-500 text-blue-500 rounded hover:bg-blue-50"
                      >
                        Edit
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

export default StockManagementComponent;
