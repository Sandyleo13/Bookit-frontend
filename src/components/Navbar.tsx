import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import logo from "../assets/Images/logo.png"; // ✅ Import logo

export default function Navbar() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = search.trim();
    navigate(`/search?q=${encodeURIComponent(trimmed)}`);
    setSearch("");
  };

  return (
    <nav className="bg-black text-white py-3 px-6 flex items-center justify-between shadow-md fixed w-full z-50">
      {/* Left: Logo */}
      <div className="flex items-center space-x-2">
        <Link to="/">
          <img
            src={logo}
            alt="BookIt Logo"
            className="h-8 w-auto object-contain"
          />
        </Link>
      </div>

      {/* Center: Search Bar */}
      <form
        onSubmit={handleSearch}
        className="flex-grow max-w-lg mx-6 relative hidden sm:block"
      >
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search experiences..."
          className="w-full px-4 py-2 rounded-md focus:outline-none text-black"
        />
        <button
          type="submit"
          className="absolute right-0 top-0 bottom-0 bg-yellow-400 text-black font-semibold px-4 rounded-r-md hover:bg-yellow-500"
        >
          Search
        </button>
      </form>

      {/* Right: Menu (Optional placeholder for icons / profile later) */}
      <div className="flex items-center gap-4">
        {/* Add user icon or login button here later */}
      </div>
    </nav>
  );
}
