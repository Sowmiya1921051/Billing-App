import { useEffect, useState } from 'react';
import axios from 'axios';

function OrderDetails() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/orders');
                setOrders(response.data);
                setLoading(false);
            } catch (error) {
                setError(error);
                setLoading(false);
            }
        };

        fetchOrders();

        const intervalId = setInterval(fetchOrders, 5000); // Refresh orders every 5 seconds

        return () => clearInterval(intervalId); // Clean up interval on component unmount
    }, []);

    // Retrieve completed orders from localStorage on component mount
    useEffect(() => {
        const completedOrders = JSON.parse(localStorage.getItem('completedOrders')) || [];
        setCompletedOrders(completedOrders);
    }, []);

    // Retrieve canceled orders from localStorage on component mount
    useEffect(() => {
        const canceledOrders = JSON.parse(localStorage.getItem('canceledOrders')) || [];
        setCanceledOrders(canceledOrders);
    }, []);

    const [completedOrders, setCompletedOrders] = useState([]);
    const [canceledOrders, setCanceledOrders] = useState([]);

    const handlePrint = (order) => {
        // Implement your logic for printing here
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <div>
                <p> Id : ${order._id}</p>
                <p>Date and Time: ${order.timestamp}</p>
                <img src="${order.imageUrl}" style="max-width:100%; height:auto;" />
            </div>
        `);
        printWindow.document.close();
        printWindow.print();
    };

    const markAsComplete = (order) => {
        const updatedCompletedOrders = [...completedOrders, order];
        setCompletedOrders(updatedCompletedOrders);
        localStorage.setItem('completedOrders', JSON.stringify(updatedCompletedOrders));
        
        // Automatically print the order
        handlePrint(order);
    };

    const markAsCancel = (order) => {
        const updatedCanceledOrders = [...canceledOrders, order];
        setCanceledOrders(updatedCanceledOrders);
        localStorage.setItem('canceledOrders', JSON.stringify(updatedCanceledOrders));
    };

    const isOrderCompleted = (order) => {
        return completedOrders.some((completedOrder) => completedOrder._id === order._id);
    };

    const isOrderCanceled = (order) => {
        return canceledOrders.some((canceledOrder) => canceledOrder._id === order._id);
    };

    const filteredOrders = orders.filter(order => !isOrderCompleted(order) && !isOrderCanceled(order));

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error fetching orders: {error.message}</div>;
    }

    return (
        <div>
            <h1 className='text-center font-bold font-2xl'>Order Details</h1>
            {filteredOrders.map((order, index) => (
                <div key={index} className="order font-bold text-xl text-green-400">
                    <p>Id : {order._id}</p>
                    <p>Date and Time : {order.timestamp}</p>
                    {order.imageUrl && (
                        <div>
                            {!isOrderCompleted(order) && !isOrderCanceled(order) && (
                                <>
                                    <button onClick={() => markAsComplete(order)} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">Complete</button>
                                    <button onClick={() => markAsCancel(order)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">Cancel</button>
                                </>
                            )}
                            {isOrderCompleted(order) && (
                                <p className="text-green-500">Order Completed</p>
                            )}
                            {isOrderCanceled(order) && (
                                <p className="text-red-500">Order Canceled</p>
                            )}
                            <img src={order.imageUrl} alt="Order" style={{ maxWidth: '100%', height: 'auto' }} />
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}

export default OrderDetails;
