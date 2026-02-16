import { BrowserRouter, Routes, Route } from "react-router-dom";
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

function App() {
  return (
    <BrowserRouter>
      <Navigation />
      <Routes>
        <Route path="/" element={<AgencyHomePage />} />
        <Route path="/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route
          path="/services/software-development"
          element={<SoftwareDevelopment />}
        />
        <Route
          path="/services/mobile-app-development"
          element={<MobileAppDevelopment />}
        />
        <Route path="/services/web-development" element={<WebDevelopment />} />
        <Route path="/services/ui-ux-design" element={<UIUXDesign />} />
        <Route
          path="/services/social-media-management"
          element={<SocialMediaManagement />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
