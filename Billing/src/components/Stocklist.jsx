import { useState, useEffect } from 'react';
import axios from 'axios';

const StockList = () => {
  const [stocks, setStocks] = useState([]);
  const [takenValues, setTakenValues] = useState({});

  useEffect(() => {
    fetchStocks();
  }, []);

  const fetchStocks = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/stock');
      setStocks(response.data);
    } catch (error) {
      console.error('Error fetching stocks:', error);
    }
  };

  const handleTakenValueChange = (id, value) => {
    setTakenValues({
      ...takenValues,
      [id]: value,
    });
  };

  const handleUpdateWeight = async (id) => {
    const takenValue = parseFloat(takenValues[id]);
    if (isNaN(takenValue) || takenValue <= 0) {
      alert('Please enter a valid number greater than 0');
      return;
    }

    try {
      await axios.patch(`http://localhost:5000/api/stock/${id}`, { takenValue });
      fetchStocks(); // Refresh the stock list after updating the weight
    } catch (error) {
      console.error('Error updating stock:', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 py-8">
      <div className="w-full max-w-3xl bg-white p-8 rounded-xl shadow-md">
        <h2 className="text-2xl font-semibold text-center mb-6">Stock List</h2>
        <table className="min-w-full bg-white text-center">
          <thead>
            <tr className="text-xl">
              <th className="py-2">Name</th>
              <th className="py-2">Weight (kg)</th>
              <th className="py-2">Taken Value (kg)</th>
              <th className="py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {stocks.map((stock, index) => (
              <tr key={stock._id} className={`border-t ${index % 2 === 0 ? 'bg-white' : 'bg-gray-100'}`}>
                <td className="py-2 px-4">{stock.name}</td>
                <td className="py-2 px-4">{stock.weight} kg</td>
                <td className="py-2 px-4">
                  <input
                    type="number"
                    value={takenValues[stock._id] || ''}
                    onChange={(e) => handleTakenValueChange(stock._id, e.target.value)}
                    className="border px-2 py-1 rounded"
                  />
                </td>
                <td className="py-2 px-4">
                  <button
                    onClick={() => handleUpdateWeight(stock._id)}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                  >
                    Update
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StockList;
