import React, { useState, useEffect } from 'react';
import axios from 'axios';

const StockManagementComponent = () => {
  const [newStock, setNewStock] = useState({ name: '', price: 0, weight: 0 });
  const [stocks, setStocks] = useState([]);
  const [stockDictionary, setStockDictionary] = useState({});
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [listSuccess, setListSuccess] = useState(null);

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/stock');
        const stockData = response.data;

        // Initialize a dictionary for aggregation
        let tempStockDictionary = {};

        // Aggregate stocks by name into a temporary dictionary
        stockData.forEach(stock => {
          if (tempStockDictionary[stock.name]) {
            tempStockDictionary[stock.name].weight += stock.weight;
          } else {
            tempStockDictionary[stock.name] = { ...stock };
          }
        });

        // Convert dictionary to array for rendering
        const stockArray = Object.values(tempStockDictionary);

        // Update state with aggregated data
        setStocks(stockArray);
        setStockDictionary(tempStockDictionary);
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
      const { name, weight } = response.data;
  
      // Check if the stock name already exists in the dictionary
      if (stockDictionary[name]) {
        const updatedWeight = stockDictionary[name].weight + weight;
        const updatedStocks = stocks.map(stock =>
          stock.name === name ? { ...stock, weight: updatedWeight } : stock
        );
  
        // Update both dictionary and array with the updated stock
        const updatedDictionary = {
          ...stockDictionary,
          [name]: { ...stockDictionary[name], weight: updatedWeight }
        };
  
        setStocks(updatedStocks);
        setStockDictionary(updatedDictionary);
      } else {
        // Add new stock to dictionary and array
        const updatedDictionary = {
          ...stockDictionary,
          [name]: { ...response.data }
        };
  
        setStocks([...stocks, response.data]);
        setStockDictionary(updatedDictionary);
      }
  
      // Add to StockList collection
      await axios.post('http://localhost:5000/api/stocklist', { name, weight });
  
      setSuccess('Stock added successfully!');
      setError(null);
      setNewStock({ name: '', price: 0, weight: 0 });
    } catch (error) {
      setError(error.message);
      setSuccess(null);
    }
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
        {listSuccess && <p className="text-green-500">{listSuccess}</p>}
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 bg-gray-200 text-gray-800 font-semibold">Name</th>
                <th className="py-2 px-4 bg-gray-200 text-gray-800 font-semibold">Total Weight</th>
              </tr>
            </thead>
            <tbody>
              {stocks.map((stock) => (
                <tr key={stock._id} className="border-t border-gray-200 text-center">
                  <td className="py-2 px-4">{stock.name}</td>
                  <td className="py-2 px-4">{stock.weight}</td>
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
