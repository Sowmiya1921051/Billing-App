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
        } else {
          setImages([response.data]);
        }
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    }

    fetchImages(); // Initial fetch

    const intervalId = setInterval(fetchImages, 1000); // Fetch every 60 seconds

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
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
    <div className="flex justify-center items-center min-h-screen">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Ordered List Images</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 ml-8">
          {filteredImages.map((image) => (
            <div key={image._id} className="p-4 border border-gray-200 rounded-md">
              <p className="font-bold">ID: {image._id}</p>
              <img
                src={`http://localhost:5000/${image.imageUrl}`}
                alt="Ordered List"
                className="w-48 h-auto mx-auto"
              />
              <div className="mt-2 flex justify-center">
                <button onClick={() => handlePrint(`http://localhost:5000/${image.imageUrl}`, image._id)} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md mr-2">Order</button>
                <button onClick={() => handleCancel(image._id)} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md">Cancel</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default OrderedListImages;
