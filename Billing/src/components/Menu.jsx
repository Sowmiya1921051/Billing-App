/* eslint-disable no-unused-vars */
import { useState, useRef, useEffect  } from 'react';
import axios from 'axios';
import { toPng } from 'html-to-image';
import { Link } from 'react-router-dom';


function Menu() {
    const [dishes, setDishes] = useState([]);
    const [soupsAndDesserts, setSoupsAndDesserts] = useState([]);
    const [drinks, setDrinks] = useState([]);

    const [counts, setCounts] = useState({});
    const [totalPrice, setTotalPrice] = useState(0);
    const [totalGST, setTotalGST] = useState(0);
    const [orderSubmitted, setOrderSubmitted] = useState(false);
    const [imageUrl, setImageUrl] = useState(null);
    const resultRef = useRef(null);

    useEffect(() => {
        // Make a GET request to fetch menu data from server
        axios.get('http://localhost:5000/api/menu')
            .then(response => {
                const { dishes, soupsAndDesserts, drinks } = response.data;
                setDishes(dishes);
                setSoupsAndDesserts(soupsAndDesserts);
                setDrinks(drinks);
            })
            .catch(error => {
                console.error('Error fetching menu data:', error);
            });
    }, []);

    // Function to add item to the order
    const handleAdd = (name, price) => {
        setCounts(prevCounts => {
            const newCounts = { ...prevCounts, [name]: (prevCounts[name] || 0) + 1 };
            calculateTotal(newCounts);
            return newCounts;
        });
    };

    // Function to remove item from the order
    const handleRemove = (name, price) => {
        setCounts(prevCounts => {
            const newCounts = { ...prevCounts, [name]: Math.max((prevCounts[name] || 0) - 1, 0) };
            calculateTotal(newCounts);
            return newCounts;
        });
    };

    // Function to calculate total price and GST
    const calculateTotal = (newCounts) => {
        let newTotalPrice = 0;

        [...dishes, ...soupsAndDesserts, ...drinks].forEach(item => {
            newTotalPrice += (newCounts[item.name] || 0) * item.price;
        });

        const GST = newTotalPrice * 0.05;
        setTotalGST(GST);
        setTotalPrice(newTotalPrice);
    };

    // Function to capture menu section as image
    const handleCapture = async () => {
        if (resultRef.current === null) {
            return;
        }

        const dataUrl = await toPng(resultRef.current);
        setImageUrl(dataUrl);
        return dataUrl;
    };

    // Function to handle order submission
    const handleSubmit = async (dataUrl) => {
        setOrderSubmitted(true);
        try {
            const order = {
                items: counts,
                totalPrice,
                totalGST,
                totalWithGST: totalPrice + totalGST,
                imageUrl: dataUrl // Pass the captured image URL here
            };
            const response = await axios.post('http://localhost:5000/api/orders', order);
            if (response.status === 201) {
                setOrderSubmitted(true);
            }
        } catch (error) {
            console.error('There was an error submitting the order!', error);
        }
    };

    // Function to handle combined capture and submit actions
    const handleCombinedFunctions = async () => {
        const dataUrl = await handleCapture();
        await handleSubmit(dataUrl);
    };


    return (
        <div>
            <p className="text-center mt-10">Open 10.00 Am - 11.00 Pm</p>
            <p className="text-center text-8xl font-bold text-green-400">Price List</p>

            <p className="text-center mt-10 text-2xl font-bold">APPETIZER & ENTREES</p>
            <div className="flex justify-around mt-10">
                <div>
                    {dishes.slice(0, 5).map((dish, index) => (
                        <div key={index} className='flex'>
                            <div className="p-4 border rounded-lg shadow-lg bg-white m-2 w-72">
                                <p className='font-bold'>{dish.name}</p>
                                <p className='mt-3'>${dish.price}</p>
                                <p>Quantity: {counts[dish.name] || 0}</p>
                                <p>Total Price: ${(counts[dish.name] || 0) * dish.price}</p>
                            </div>
                            <button className='text-4xl text-red-600 font-bold ml-5' onClick={() => handleAdd(dish.name, dish.price)}>+</button>
                            <button className='text-4xl text-blue-600 font-bold ml-2' onClick={() => handleRemove(dish.name, dish.price)}>-</button>
                        </div>
                    ))}
                </div>
                <div>
                    {dishes.slice(5, 10).map((dish, index) => (
                        <div key={index} className='flex'>
                            <div className="p-4 border rounded-lg shadow-lg bg-white m-2 w-72">
                                <p className='font-bold'>{dish.name}</p>
                                <p className='mt-3'>${dish.price}</p>
                                <p>Quantity: {counts[dish.name] || 0}</p>
                                <p>Total Price: ${(counts[dish.name] || 0) * dish.price}</p>
                            </div>
                            <button className='text-4xl text-red-600 font-bold ml-5' onClick={() => handleAdd(dish.name, dish.price)}>+</button>
                            <button className='text-4xl text-blue-600 font-bold ml-2' onClick={() => handleRemove(dish.name, dish.price)}>-</button>
                        </div>
                    ))}
                </div>
            </div>

            <p className="text-center mt-10 text-2xl font-bold">SOUP & DESSERT</p>
            <div className="flex justify-around mt-10">
                <div>
                    {soupsAndDesserts.slice(0, 5).map((item, index) => (
                        <div key={index} className='flex'>
                            <div className="p-4 border rounded-lg shadow-lg bg-white m-2 w-72">
                                <p className='font-bold'>{item.name}</p>
                                <p className='mt-3'>${item.price}</p>
                                <p>Quantity: {counts[item.name] || 0}</p>
                                <p>Total Price: ${(counts[item.name] || 0) * item.price}</p>
                            </div>
                            <button className='text-4xl text-red-600 font-bold ml-5' onClick={() => handleAdd(item.name, item.price)}>+</button>
                            <button className='text-4xl text-blue-600 font-bold ml-2' onClick={() => handleRemove(item.name, item.price)}>-</button>
                        </div>
                    ))}
                </div>
                <div>
                    {soupsAndDesserts.slice(5, 10).map((item, index) => (
                        <div key={index} className='flex'>
                            <div className="p-4 border rounded-lg shadow-lg bg-white m-2 w-72">
                                <p className='font-bold'>{item.name}</p>
                                <p className='mt-3'>${item.price}</p>
                                <p>Quantity: {counts[item.name] || 0}</p>
                                <p>Total Price: ${(counts[item.name] || 0) * item.price}</p>
                            </div>
                            <button className='text-4xl text-red-600 font-bold ml-5' onClick={() => handleAdd(item.name, item.price)}>+</button>
                            <button className='text-4xl text-blue-600 font-bold ml-2' onClick={() => handleRemove(item.name, item.price)}>-</button>
                        </div>
                    ))}
                </div>
            </div>

            <p className="text-center mt-10 text-2xl font-bold">DRINKS</p>
            <div className="flex justify-around mt-10">
                <div>
                    {drinks.slice(0, 5).map((drink, index) => (
                        <div key={index} className='flex'>
                            <div className="p-4 border rounded-lg shadow-lg bg-white m-2 w-72">
                                <p className='font-bold'>{drink.name}</p>
                                <p className='mt-3'>${drink.price}</p>
                                <p>Quantity: {counts[drink.name] || 0}</p>
                                <p>Total Price: ${(counts[drink.name] || 0) * drink.price}</p>
                            </div>
                            <button className='text-4xl text-red-600 font-bold ml-5' onClick={() => handleAdd(drink.name, drink.price)}>+</button>
                            <button className='text-4xl text-blue-600 font-bold ml-2' onClick={() => handleRemove(drink.name, drink.price)}>-</button>
                        </div>
                    ))}
                </div>
                <div>
                    {drinks.slice(5, 10).map((drink, index) => (
                        <div key={index} className='flex'>
                            <div className="p-4 border rounded-lg shadow-lg bg-white m-2 w-72">
                                <p className='font-bold'>{drink.name}</p>
                                <p className='mt-3'>${drink.price}</p>
                                <p>Quantity: {counts[drink.name] || 0}</p>
                                <p>Total Price: ${(counts[drink.name] || 0) * drink.price}</p>
                            </div>
                            <button className='text-4xl text-red-600 font-bold ml-5' onClick={() => handleAdd(drink.name, drink.price)}>+</button>
                            <button className='text-4xl text-blue-600 font-bold ml-2' onClick={() => handleRemove(drink.name, drink.price)}>-</button>
                        </div>
                    ))}
                </div>
            </div>

            <div
                style={{
                    position: 'fixed',
                    bottom: '10px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    backgroundColor: '#90EE90',
                    padding: '20px',
                    borderRadius: '8px',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                    width: '20%',
                    maxHeight: '50vh',
                    overflowY: 'auto',
                }}
            >
                <div ref={resultRef} className="text-center p-5">
                    <p className="text-lg font-bold">Total Price: ${totalPrice.toFixed(2)}</p>
                    <p className="text-lg">GST (5%): ${totalGST.toFixed(2)}</p>
                    <p className="text-lg font-bold">Total Price with GST: ${(totalPrice + totalGST).toFixed(2)}</p>
                    <input type="email" placeholder="Enter your Email" className="mt-2 px-4 py-2 border-b border-gray-300 focus:border-blue-500 focus:outline-none"/>


                            <div >
                                <p className="font-bold mt-5 text-lg ">Order Summary:</p>
                                {Object.keys(counts).map(key => (
                                    counts[key] > 0 && <p key={key} className="text-md">{key}: {counts[key]}</p>
                                ))}
                            </div>
                        </div>
                        <div className="text-center mt-5">
                            {imageUrl && (
                                <div>
                                    <p className="font-bold">Image URL:</p>
                                    <input
                                        type="text"
                                        className="mt-2 p-2 border border-gray-300 rounded w-full"
                                        value={imageUrl}
                                        readOnly
                                    />

                                    {/* <img src={imageUrl} alt="Ordered items" className="mt-2 w-full" /> Display the image */}
                                </div>
                            )}
                        </div>
                        {orderSubmitted && (
                            <div className="text-center mt-5">
                                <p className="text-green-600 font-bold text-lg">Order successfully submitted!</p>
                            </div>
                        )}
                        <div className="text-center mt-10">
                            <button
                                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                                onClick={handleCombinedFunctions}
                            >
                                Submit
                            </button>
                        </div>
                        <div className="text-center mt-5">
                            <Link to="/orders">
                                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                                    View Orders
                                </button>
                            </Link>
                        </div>
                </div>
            </div>
            );
}

            export default Menu;
