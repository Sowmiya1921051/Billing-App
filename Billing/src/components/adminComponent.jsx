import { useState, useEffect } from 'react';
import axios from 'axios';

function OrderedListImages() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orderedImages, setOrderedImages] = useState([]);

  useEffect(() => {
    async function fetchImages() {
      try {
        const response = await axios.get('http://localhost:5000/api/orderedList');
        if (Array.isArray(response.data)) {
          setImages(response.data);
          setLoading(false);
        } else {
          setImages([response.data]);
          setLoading(false);
        }
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    }

    fetchImages();
  }, []);

  useEffect(() => {
    const orderedImagesFromStorage = JSON.parse(localStorage.getItem('orderedImages')) || [];
    setOrderedImages(orderedImagesFromStorage);
  }, []);

  const handlePrint = async (imageUrl, id) => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <div>
        <p>ID: ${id}</p>
        <img src="${imageUrl}" style="max-width:100%; height:auto;" />
      </div>
    `);
    printWindow.document.close();
    printWindow.print();
    const updatedOrderedImages = [...orderedImages, id];
    setOrderedImages(updatedOrderedImages);
    localStorage.setItem('orderedImages', JSON.stringify(updatedOrderedImages));

    // Update order status to 'Ordered'
    try {
      await axios.put(`http://localhost:5000/api/orderedList/${id}`, { status: 'Ordered' });
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const handleCancel = async (id) => {
    const updatedOrderedImages = [...orderedImages, id];
    setOrderedImages(updatedOrderedImages);
    localStorage.setItem('orderedImages', JSON.stringify(updatedOrderedImages));

    // Update order status to 'Cancelled'
    try {
      await axios.put(`http://localhost:5000/api/orderedList/${id}`, { status: 'Cancelled' });
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  // Filter out the ordered images from the images array
  const filteredImages = images.filter(image => !orderedImages.includes(image._id));

  return (
    <div>
      <h2>Ordered List Images</h2>
      <div>
        {filteredImages.map((image) => (
          <div key={image._id}>
            <p>ID: {image._id}</p>
            <img
              src={`http://localhost:5000/${image.imageUrl}`}
              alt="Ordered List"
              style={{ width: '200px', height: 'auto', margin: '10px' }}
            />
            <button onClick={() => handlePrint(`http://localhost:5000/${image.imageUrl}`, image._id)}>Order</button>
            <button onClick={() => handleCancel(image._id)}>Cancel</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default OrderedListImages;
