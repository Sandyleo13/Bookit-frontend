import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

interface Experience {
  id: number;
  title: string;
  description: string;
  location?: string;
  price: number;
  image?: string;
  slots?: { date: string; available: boolean }[];
}

export default function SearchDetails() {
  const { id } = useParams();
  const [experience, setExperience] = useState<Experience | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // ✅ Fetch experience details from live backend
  useEffect(() => {
    const fetchExperience = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/experiences/${id}`);
        if (!res.ok) throw new Error("Failed to fetch experience details");
        const data = await res.json();
        setExperience(data);
      } catch (err) {
        console.error("❌ Error fetching experience details:", err);
        setError("Unable to load experience details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchExperience();
  }, [id, API_BASE_URL]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-600 text-lg">
        Loading experience details...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center mt-20 text-red-600 text-lg">{error}</div>
    );
  }

  if (!experience) {
    return (
      <div className="text-center mt-20 text-gray-500 text-lg">
        Experience not found.
      </div>
    );
  }

  // ✅ Smart image fallback
  const imageUrl = experience.image
    ? experience.image.startsWith("http")
      ? experience.image
      : `${API_BASE_URL}/${experience.image}`
    : "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80";

  return (
    <div className="p-6 max-w-4xl mx-auto pt-24">
      <img
        src={imageUrl}
        alt={experience.title}
        className="w-full h-64 object-cover rounded-xl mb-6"
        onError={(e) => {
          (e.target as HTMLImageElement).src =
            "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80";
        }}
      />

      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        {experience.title}
      </h1>

      {experience.location && (
        <p className="text-gray-500 mb-2">📍 {experience.location}</p>
      )}

      <p className="text-gray-700 mb-4 leading-relaxed">
        {experience.description ||
          "No detailed description available for this experience."}
      </p>

      <h3 className="text-xl font-semibold mb-2">Available Dates</h3>

      {experience.slots && experience.slots.length > 0 ? (
        <ul className="flex gap-2 flex-wrap mb-6">
          {experience.slots.map((slot) => (
            <li
              key={slot.date}
              onClick={() => slot.available && setSelectedDate(slot.date)}
              className={`px-4 py-2 border rounded-md cursor-pointer transition ${
                slot.available
                  ? selectedDate === slot.date
                    ? "bg-yellow-400 text-black border-yellow-500"
                    : "bg-gray-50 hover:bg-yellow-100"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              {slot.date}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 mb-6">No available slots.</p>
      )}

      <p className="text-lg font-semibold text-yellow-600 mb-6">
        ₹{experience.price}
      </p>

      <Link
        to={`/checkout?id=${experience.id}&date=${selectedDate || ""}`}
        className={`px-6 py-2 rounded-md font-medium ${
          selectedDate
            ? "bg-yellow-400 text-black hover:bg-yellow-500"
            : "bg-gray-300 text-gray-500 cursor-not-allowed"
        }`}
        onClick={(e) => {
          if (!selectedDate) e.preventDefault();
        }}
      >
        Book Now
      </Link>
    </div>
  );
}
