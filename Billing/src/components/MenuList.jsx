// AddDishForm.jsx
import  { useState } from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom'
const AddDishForm = () => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState(null);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted:', { name, price, image });
    const formData = new FormData();
    formData.append('name', name);
    formData.append('originalPrice', price);
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
      setImage(null);
    } catch (error) {
      alert('Error adding dish');
      console.error('Axios error:', error);
    }
  };

  return (
    <div>
      <h2>Add Dish</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block">Name:</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="border rounded px-2 py-1" />
        </div>
        <div>
          <label className="block">Original Price:</label>
          <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="border rounded px-2 py-1" />
        </div>
        <div>
          <label className="block">Image:</label>
          <input type="file" onChange={handleImageChange} className="border rounded px-2 py-1" />
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Add Dish</button>
      </form>
      <Link to='/orders' type="submit" className="bg-green-500 text-white px-4 py-2 rounded mt-10 p-10">View Orders</Link>
    </div>
  );
};

export default AddDishForm;
