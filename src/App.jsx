import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import AgencyHomePage from "./components/AgencyHomePage/AgencyHomePage";
import Navigation from "./components/Navigation/Navigation";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import SoftwareDevelopment from "./pages/SoftwareDevelopment";
import MobileAppDevelopment from "./components/MobileAppDevelopment/MobileAppDevelopment";
import WebDevelopment from "./components/WebDevelopment/WebDevelopment";
import UIUXDesign from "./components/UIUXDesign/UIUXDesign";
import SocialMediaManagement from "./components/SocialMediaManagement/SocialMediaManagement";
import DigitalMarketing from "./components/DigitalMarketing/DigitalMarketing";
import Portfolio from "./components/Portfolio/Portfolio";
import Contact from "./components/Contact/Contact";
import About from "./components/About/About";
import Blog from "./components/Blog/Blog";
import Cart from "./components/Cart/Cart";
import Checkout from "./components/Checkout/Checkout";
import OrderConfirmation from "./components/OrderConfirmation/OrderConfirmation";
import Orders from "./components/Orders/Orders";
import OrderDetails from "./components/Orders/Orderdetails";
import { ToastProvider } from "./components/Toast/Toastcontainer";
import PaymentVerify from "./pages/PaymentVerify/PaymentVerify";
import Register from "./pages/Register";

// A simple guard component
const AdminRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const token = localStorage.getItem("token");
  if (!token || user?.role !== "admin") return <Navigate to="/login" replace />;
  if (token && user?.role === "admin") return <Navigate to="/admin" replace />;
  return children;
};

function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Navigation />
        <Routes>
          <Route path="/" element={<AgencyHomePage />} />

          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
          <Route path="/login" element={<AdminLogin />} />
          <Route path="/register" element={<Register />} />
          {/* <Route path="/login" element={<AdminLogin />} /> */}
          {/* <Route path="/register" element={<Register />} /> */}
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/payment/verify" element={<PaymentVerify />} />
          <Route path="/order-confirmation" element={<OrderConfirmation />} />
          {/* <Route path="/order/:id" element={<OrderConfirmation />} /> */}
          <Route path="/orders" element={<Orders />} />
          <Route path="/orders/:id" element={<OrderDetails />} />
          {/* <Route path="/admin" element={<AdminDashboard />} /> */}
          <Route
            path="/services/custom-software-development"
            element={<SoftwareDevelopment />}
          />
          <Route
            path="/services/mobile-app-development"
            element={<MobileAppDevelopment />}
          />
          <Route
            path="/services/web-development"
            element={<WebDevelopment />}
          />
          <Route path="/services/ui-ux-design" element={<UIUXDesign />} />
          <Route
            path="/services/social-media-management"
            element={<SocialMediaManagement />}
          />
          <Route
            path="/services/digital-marketing"
            element={<DigitalMarketing />}
          />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/about" element={<About />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  );
}

export default App;
