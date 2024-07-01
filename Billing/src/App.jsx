import  { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MenuList from './components/MenuList';
import ViewOrders from './components/viewOrders';
import OrderPage from './components/OrderPage';
import Admin from './components/adminComponent';
import Signup from './components/Signup';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import OrderedData from './components/OrderedData'
import Stock from './components/Stock'
import Sales from './components/Sales'
import Review from './components/Review';
import Account from './components/Account';
import Payment from './components/Payment';
import Stocklist from './components/Stocklist';
import KOT from './components/KOT';
import Table from './components/Table';
import TableOrders from './components/tableOrders';
import Bill from './components/Bill'
import Takeaway from './components/Takeaway'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('token'));
  const [selectedValues, setSelectedValues] = useState(null); // Moved state declaration here

  const handleSignup = () => {
    setIsLoggedIn(true);
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
  };

  return (
    <div>
      <BrowserRouter>
        {/* Render Dashboard component conditionally */}
        {isLoggedIn && <Dashboard isLoggedIn={isLoggedIn} onLogout={handleLogout} />} 

        <Routes>
          <Route
            path="/"
            element={isLoggedIn ? <Navigate to="/orders" replace /> : <Signup onSignup={handleSignup} />}
          />
          <Route
            path="/login"
            element={isLoggedIn ? <Navigate to="/orders" replace /> : <Login onLogin={handleLogin} />}
          />
          <Route path="/orders" element={<ViewOrders onLogout={handleLogout} />} />
          <Route path="/menulist" element={isLoggedIn ? <MenuList /> : <Navigate to="/" replace />} />
          <Route path="/orderpage" element={isLoggedIn ? <OrderPage /> : <Navigate to="/" replace />} />
          <Route path="/adminComponent" element={isLoggedIn ? <Admin /> : <Navigate to="/" replace />} />
          <Route path="/orderedData" element={isLoggedIn ? <OrderedData /> : <Navigate to="/" replace />} />
          <Route path="/stock" element={isLoggedIn ? <Stock /> : <Navigate to="/" replace />} />
          <Route path="/sales" element={isLoggedIn ? <Sales /> : <Navigate to="/" replace />} />
          <Route path="/reviews" element={isLoggedIn ? <Review /> : <Navigate to="/" replace />} />
          <Route path="/account" element={isLoggedIn ? <Account /> : <Navigate to="/" replace />} />
          <Route path="/payment" element={isLoggedIn ? <Payment /> : <Navigate to="/" replace />} />
          <Route path="/stocklist" element={isLoggedIn ? <Stocklist /> : <Navigate to="/" replace />} />
          <Route path="/KOT" element={isLoggedIn ? <KOT /> : <Navigate to="/" replace />} />
          <Route path="/table" element={isLoggedIn ? <Table {...selectedValues} /> : <Navigate to="/" replace />} />
          <Route path="/tableOrders" element={isLoggedIn ? <TableOrders setSelectedValues={setSelectedValues} /> : <Navigate to="/" replace />} />
          <Route path="/bill" element={isLoggedIn ? <Bill /> : <Navigate to="/" replace />} />
          <Route path="/takeaway" element={isLoggedIn ? <Takeaway /> : <Navigate to="/" replace />} />

        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
