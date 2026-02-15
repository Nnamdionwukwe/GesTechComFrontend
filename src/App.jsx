import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import AgencyHomePage from "./components/AgencyHomePage/AgencyHomePage";
import Navigation from "./components/Navigation/Navigation";

function App() {
  return (
    <BrowserRouter>
      <Navigation />
      <Routes>
        <Route path="/" element={<AgencyHomePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
