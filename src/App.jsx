import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import AgencyHomePage from "./components/AgencyHomePage/AgencyHomePage";
import Navigation from "./components/Navigation/Navigation";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import FileUpload from "./pages/Fileupload";
import SoftwareDevelopment from "./pages/SoftwareDevelopment";
import MobileAppDevelopment from "./components/MobileAppDevelopment/MobileAppDevelopment";

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
        {/* <Route
          path="/fileupload"
          element={
            <FileUpload
              type="services"
              multiple={true}
              maxFiles={5}
              onUploadSuccess={(data) => console.log("Success!", data)}
              onUploadError={(error) => console.error("Error:", error)}
            />
          }
        /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
