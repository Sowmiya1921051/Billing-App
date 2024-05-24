import  { useState, useEffect } from 'react';
import axios from 'axios';

function DishList() {
  const [dishes, setDishes] = useState([]);

  useEffect(() => {
    // Fetch dishes from backend when the component mounts
    axios.get('http://localhost:5000/api/dishes')
      .then(response => {
        setDishes(response.data); // Set the fetched dishes in state
      })
      .catch(error => {
        console.error('Error fetching dishes:', error);
      });
  }, []); // Empty dependency array means this effect runs only once after the component mounts

  return (
    <div>
      <h2>Dishes</h2>
      <ul>
        {dishes.map(dish => (
          <li key={dish._id}>
            <h3>{dish.name}</h3>
            <p>Original Price: ${dish.originalPrice}</p>
            <p>GST Rate: {dish.gstRate}</p>
            <p>Price with GST: ${dish.priceWithGST}</p>
            {dish.imageUrl && <img src={`http://localhost:5000/${dish.imageUrl}`} alt={dish.name} style={{ maxWidth: '200px' }} />}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default DishList;
