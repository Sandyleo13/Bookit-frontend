import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Checkout from "./pages/Checkout";
import Result from "./pages/Result";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import SearchPage from "./pages/search";
import Details from "./pages/Details"; 
import "react-day-picker/dist/style.css";

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-cardBg">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/details/:id" element={<Details />} /> {/* ✅ Keep only this */}
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/result" element={<Result />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
