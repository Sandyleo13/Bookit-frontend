import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

interface Experience {
  id: number;
  title: string;
  description?: string;
  image?: string;
  location?: string;
  price: number | string;
}

export default function SearchPage() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const query = params.get("q")?.toLowerCase() || "";

  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [filtered, setFiltered] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // ✅ Fetch all experiences from live backend
  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/experiences`);
        if (!res.ok) throw new Error("Failed to load experiences");
        const data = await res.json();
        setExperiences(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Unable to fetch experiences."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchExperiences();
  }, [API_BASE_URL]);

  // ✅ Filter whenever query or experiences change
  useEffect(() => {
    const results = experiences.filter(
      (exp) =>
        exp.title?.toLowerCase().includes(query) ||
        exp.location?.toLowerCase().includes(query)
    );
    setFiltered(results);
  }, [query, experiences]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-600 text-lg">
        Loading experiences...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-600 text-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-screen-xl mx-auto">
        <h2 className="text-2xl font-bold mb-8 text-gray-900">
          Search Results for “{query || "All"}”
        </h2>

        {filtered.length === 0 ? (
          <p className="text-center text-gray-500 mt-20 text-lg">
            No experiences found for “{query}”
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filtered.map((exp) => {
              const imageUrl = exp.image
                ? exp.image.startsWith("http")
                  ? exp.image
                  : `${API_BASE_URL}/${exp.image}`
                : "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=60";

              return (
                <article
                  key={exp.id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition transform hover:-translate-y-1"
                >
                  <img
                    src={imageUrl}
                    alt={exp.title}
                    className="w-full h-44 object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=60";
                    }}
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {exp.title}
                    </h3>
                    {exp.location && (
                      <p className="text-sm text-gray-500 mt-1">{exp.location}</p>
                    )}
                    <div className="mt-3 flex items-center justify-between">
                      <span className="font-semibold text-gray-900">
                        ₹{exp.price}
                      </span>
                      <Link
                        to={`/details/${exp.id}`}
                        className="text-yellow-600 hover:text-yellow-700 font-medium text-sm"
                      >
                        View Details →
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
