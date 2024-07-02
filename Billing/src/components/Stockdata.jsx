import axios from 'axios';
import React, { useState, useEffect } from 'react';

const Stockdata = () => {
  const [stocks, setStocks] = useState([]);
  const [error, setError] = useState(null);
  const [listSuccess, setListSuccess] = useState(null);
  const [reduceAmount, setReduceAmount] = useState({});

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/stockdata');
        const stockData = response.data;
        
        setStocks(stockData);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchStocks();
  }, []);

  const handleReduceWeightChange = (id, value) => {
    setReduceAmount({ ...reduceAmount, [id]: value });
  };

  const handleReduceWeight = async (id, name) => {
    const amount = parseFloat(reduceAmount[id]);
    if (isNaN(amount) || amount <= 0) {
      setError("Please enter a valid number");
      return;
    }

    try {
      const response = await axios.patch(`http://localhost:5000/api/stockdata/${id}`, { takenValue: amount });
      const updatedStock = response.data;

      const updatedStocks = stocks.map(stock => (stock._id === id ? updatedStock : stock));

      setStocks(updatedStocks);
      setError(null);
      setListSuccess("Weight updated successfully!");
      setReduceAmount({ ...reduceAmount, [id]: '' });

      // Add to stocktaken collection
      await axios.post('http://localhost:5000/api/stocktaken', { name: name, weightTaken: amount });
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="p-4">
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
                <th className="py-2 px-4 bg-gray-200 text-gray-800 font-semibold">Reduce Weight</th>
              </tr>
            </thead>
            <tbody>
              {stocks.map((stock) => (
                <tr key={stock._id} className="border-t border-gray-200 text-center">
                  <td className="py-2 px-4">{stock.name}</td>
                  <td className="py-2 px-4">{stock.weight}</td>
                  <td className="py-2 px-4">
                    <input
                      type="number"
                      value={reduceAmount[stock._id] || ''}
                      onChange={(e) => handleReduceWeightChange(stock._id, e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                    <button
                      onClick={() => handleReduceWeight(stock._id, stock.name)}
                      className="mt-2 w-full p-2 border-2 border-blue-500 text-blue-500 rounded hover:bg-blue-50"
                    >
                      Reduce
                    </button>
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

export default Stockdata;
    