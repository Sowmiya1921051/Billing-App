import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const SalesDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortedDishes, setSortedDishes] = useState([]);
  const [sales, setSales] = useState([]);
  const [monthlyReport, setMonthlyReport] = useState([]);
  const [monthlyTopDishes, setMonthlyTopDishes] = useState([]);
  const [monthlyContinuousDishes, setMonthlyContinuousDishes] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/orderedList');
      setOrders(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError('Error fetching orders');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    if (orders.length > 0) {
      const dishesMap = new Map();
      const monthlyMap = new Map();

      orders.forEach(order => {
        if (order.status === "Ordered") {
          order.orders.forEach(item => {
            // Aggregate total quantity of each dish
            if (dishesMap.has(item.name)) {
              dishesMap.set(item.name, dishesMap.get(item.name) + item.quantity);
            } else {
              dishesMap.set(item.name, item.quantity);
            }

            // Group orders by month
            const month = new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
            if (!monthlyMap.has(month)) {
              monthlyMap.set(month, { totalOrders: 0, totalRevenue: 0, totalGST: 0, dishOrders: new Map() });
            }

            const monthData = monthlyMap.get(month);
            monthData.totalOrders += 1;
            monthData.totalRevenue += item.totalPrice;
            monthData.totalGST += item.gstPrice;

            // Track individual dish orders
            if (monthData.dishOrders.has(item.name)) {
              monthData.dishOrders.set(item.name, monthData.dishOrders.get(item.name) + item.quantity);
            } else {
              monthData.dishOrders.set(item.name, item.quantity);
            }
          });
        }
      });

      const sortedDishesArray = Array.from(dishesMap.entries()).sort((a, b) => b[1] - a[1]);
      setSortedDishes(sortedDishesArray);

      const processedSales = orders.reduce((acc, order) => {
        if (order.status === "Ordered") {
          order.orders.forEach(item => {
            const date = new Date(order.createdAt).toLocaleDateString();
            acc.push({
              date,
              name: item.name,
              quantity: item.quantity,
              totalPrice: item.totalPrice,
              gstPrice: item.gstPrice
            });
          });
        }
        return acc;
      }, []);
      setSales(processedSales);

      // Process monthly report and top dishes
      const monthlyReportArray = Array.from(monthlyMap.entries()).map(([month, data]) => {
        const topDishes = Array.from(data.dishOrders.entries()).sort((a, b) => b[1] - a[1]).slice(0, 3);
        const continuousDishes = Array.from(data.dishOrders.entries()).filter(([_, value]) => value >= 2);

        return { month, ...data, topDishes, continuousDishes };
      });
      setMonthlyReport(monthlyReportArray);

      // Extract top dishes and continuous dishes for each month
      const topDishesPerMonth = monthlyReportArray.map(({ month, topDishes }) => ({ month, topDishes }));
      const continuousDishesPerMonth = monthlyReportArray.map(({ month, continuousDishes }) => ({ month, continuousDishes }));
      setMonthlyTopDishes(topDishesPerMonth);
      setMonthlyContinuousDishes(continuousDishesPerMonth);
    }
  }, [orders]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center">{error}</div>;
  }

  // Prepare data for the bar chart
  const chartData = {
    labels: monthlyReport.map(report => report.month),
    datasets: [
      {
        label: 'Total Orders',
        data: monthlyReport.map(report => report.totalOrders),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
      {
        label: 'Total Revenue',
        data: monthlyReport.map(report => report.totalRevenue),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
      {
        label: 'Total GST',
        data: monthlyReport.map(report => report.totalGST),
        backgroundColor: 'rgba(255, 206, 86, 0.6)',
        borderColor: 'rgba(255, 206, 86, 1)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const top5Dishes = sortedDishes.slice(0, 5);
  const per=sortedDishes.slice(0, 5).reduce((acc, [, quantity]) => acc + quantity, 0)
  const chartData1 = {
    labels: top5Dishes.map(([dish]) => dish),
    datasets: [
      {
        label: 'Total Orders',
        data: top5Dishes.map(([_, quantity]) => quantity *per /100),
        backgroundColor: ['rgba(255, 99, 132, 0.6)', 'rgba(54, 162, 235, 0.6)', 'rgba(255, 206, 86, 0.6)', 'rgba(75, 192, 192, 0.6)', 'rgba(153, 102, 255, 0.6)'],
        borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)', 'rgba(75, 192, 192, 1)', 'rgba(153, 102, 255, 1)'],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions1 = {
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
      },
    },
  };




  return (
    <div className="min-h-screen flex flex-row">
      {/* Navbar */}
      <div className="text-white w-64 p-6">
        {/* Navbar content */}
      </div>

      {/* Main Content */}
      <div className="flex flex-col flex-1 items-center justify-center mt-10">
        {/* Order Data */}
        <div className="bg-white shadow-xl border-indigo-600 border-4 rounded p-6 w-full max-w-4xl mb-8">
          <h2 className="text-2xl font-bold mb-4">Order Data</h2>
          <div className="mb-4">
            <h3 className="text-lg font-semibold">
              Current Date and Time: {currentTime.toLocaleDateString()} {currentTime.toLocaleTimeString()}
            </h3>
            <div className="flex items-center justify-center mb-8 h-96 w-96">
              <Doughnut data={chartData1} options={chartOptions1} />
            </div>

          </div>
          {sortedDishes.length > 0 && (
            <div className="mb-4">
              <p className="mt-2 font-bold text-center text-2xl text-indigo-600">Total Top 5 Orders: {sortedDishes.slice(0, 5).reduce((acc, [, quantity]) => acc + quantity, 0)} orders</p>
              <h3 className="text-lg font-semibold mt-5">Dishes Ordered by Total Sales:</h3>
              <ul className="list-disc ml-5">
                {sortedDishes.map(([dish, quantity], index) => (
                  <li key={index} className="mt-2">{dish} - {quantity} orders</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Sales Report */}
        <div className="bg-white shadow-xl border-indigo-600 border-4 rounded p-6 w-full max-w-4xl mb-8">
          <h2 className="text-2xl font-bold mb-6 text-center">Sales Report</h2>
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-2 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-4 py-2 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-4 py-2 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                <th className="px-4 py-2 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Price</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sales.map((sale, index) => (
                <tr key={index} className="hover:bg-gray-100">
                  <td className="px-4 py-2 whitespace-nowrap">{sale.date}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{sale.name}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{sale.quantity}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{sale.totalPrice}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Monthly Report */}
        <div className="bg-white border-indigo-600 shadow-xl border-4 rounded p-6 w-full max-w-4xl mb-8">
          <h2 className="text-2xl font-bold mb-6 text-center">Monthly Report</h2>
          <div className="mb-8">
            <Bar data={chartData} options={chartOptions} />
          </div>
          {monthlyReport.map((report, index) => (
            <div key={index} className="mb-4">
              <h3 className="text-lg font-semibold">{report.month}</h3>
              <p>Total Orders: {report.totalOrders}</p>
              <p>Total Revenue: {report.totalRevenue}</p>
              <p>Total GST: {report.totalGST}</p>
              <div>
                <h4 className="text-md font-semibold">Top Selling Dishes:</h4>
                <ul>
                  {report.topDishes.map(([dish, quantity], index) => (
                    <li key={index}>{dish}: {quantity} orders</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-md font-semibold">Dishes Ordered Continuously:</h4>
                <ul>
                  {report.continuousDishes.map(([dish, quantity], index) => (
                    <li key={index}>{dish}: {quantity} orders</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SalesDashboard;