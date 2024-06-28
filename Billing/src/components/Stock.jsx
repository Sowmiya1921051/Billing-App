import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
    const [stocks, setStocks] = useState([]);
    const [name, setName] = useState('');
    const [value, setValue] = useState('');

    useEffect(() => {
        fetchStocks();
    }, []);

    const fetchStocks = async () => {
        const response = await axios.get('http://localhost:5000/api/stocks');
        setStocks(response.data);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await axios.post('http://localhost:5000/api/stocks', { name, value });
        setName('');
        setValue('');
        fetchStocks();
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Stock Values</h1>
            <div className="flex">
                {/* Left side: Form */}
                <div className="w-1/3">
                    <form onSubmit={handleSubmit} className="mb-4">
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                                Stock Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                placeholder="Stock Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="border rounded w-full py-2 px-3 text-gray-700"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="value">
                                Stock Value
                            </label>
                            <input
                                type="number"
                                id="value"
                                placeholder="Stock Value"
                                value={value}
                                onChange={(e) => setValue(e.target.value)}
                                className="border rounded w-full py-2 px-3 text-gray-700"
                            />
                        </div>
                        <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">
                            Add Stock
                        </button>
                    </form>
                </div>

                {/* Right side: Stock list */}
                <div className="w-2/3">
                    <ul>
                        {stocks.map(stock => (
                            <li key={stock._id} className="border p-4 mb-2 rounded shadow-sm">
                                <span className="font-bold">{stock.name}</span>: ${stock.value}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default App;
