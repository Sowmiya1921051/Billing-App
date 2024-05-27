import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Menu from "./components/Menu";
// import OrderDetails from "./components/OrderDetails";
import MenuList from "./components/MenuList";
import ViewOrders from "./components/viewOrders";
import OrderPage from './components/OrderPage'
import Admin from "./components/adminComponent";

function App() {
  return (
    <div>
        <BrowserRouter>
            <Routes>
                {/* <Route path="/" element={<Menu />} />
                <Route path="/orders" element={<OrderDetails/>} />   */}
                <Route path="/"  element={<MenuList/>} />
                <Route path="/orders" element={<ViewOrders/>}    />
                <Route path="/ordersPage" element={<OrderPage/>} />
                <Route path="/adminComponent" element={<Admin/>}/>
            </Routes>
        </BrowserRouter>
    </div>
  );
}

export default App;
