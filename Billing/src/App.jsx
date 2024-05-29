import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MenuList from './components/MenuList';
import ViewOrders from './components/viewOrders';
import OrderPage from './components/OrderPage';
import Admin from './components/adminComponent';
import Signup from './components/Signup';
import Login from './components/Login';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('token'));

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
        <Routes>
          <Route path="/" element={!isLoggedIn ? <Signup onSignup={handleSignup} /> : <Navigate to="/login" replace />} />
          <Route path="/login" element={isLoggedIn ? <Navigate to="/menulist" replace /> : <Login onLogin={handleLogin} />} />
          <Route path="/menulist" element={<MenuList onLogout={handleLogout} />} />
          <Route path="/orders" element={isLoggedIn ? <ViewOrders /> : <Navigate to="/" replace />} />
          <Route path="/orderpage" element={isLoggedIn ? <OrderPage /> : <Navigate to="/" replace />} />
          <Route path="/aboutComponent" element={isLoggedIn ? <Admin /> : <Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;