import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Title, Meta } from "react-head";

interface Experience {
  id: number;
  title: string;
  description: string;
  image?: string;
  location?: string;
  price: number | string;
}

export default function Home() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);

  // ✅ Use your Railway backend base URL from .env
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/experiences`);
        if (!response.ok) throw new Error("Failed to fetch experiences");
        const data = await response.json();
        setExperiences(data);
      } catch (error) {
        console.error("Error fetching experiences:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchExperiences();
  }, [API_BASE_URL]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-600 text-lg">
        Loading experiences...
      </div>
    );
  }

  return (
    <>
      <Title>BookIt | Discover Experiences</Title>
      <Meta
        name="description"
        content="Explore and book curated travel experiences, adventures, and retreats through BookIt."
      />

      <div className="min-h-screen bg-white pt-24 pb-12 px-6 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <header className="mb-10 text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900">
              Discover Unique Experiences
            </h1>
            <p className="mt-3 text-gray-600 text-sm sm:text-base max-w-2xl mx-auto">
              Curated adventures and retreats led by trusted experts. Choose your
              dates, book easily, and start your journey.
            </p>
          </header>

          {experiences.length === 0 ? (
            <p className="text-gray-600 text-center">
              No experiences available at the moment.
            </p>
          ) : (
            <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {experiences.map((exp) => {
                // ✅ Use your live backend base URL for image paths
                const imageUrl = exp.image
                  ? exp.image.startsWith("http")
                    ? exp.image
                    : `${API_BASE_URL}/${exp.image}`
                  : "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=60";

                return (
                  <article
                    key={exp.id}
                    className="rounded-2xl overflow-hidden shadow-md border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-transform bg-white"
                  >
                    <div className="w-full h-56 overflow-hidden">
                      <img
                        src={imageUrl}
                        alt={exp.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    <div className="p-5 flex flex-col justify-between min-h-[220px]">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {exp.title}
                        </h3>
                        {exp.location && (
                          <p className="text-sm text-gray-500 mt-1">{exp.location}</p>
                        )}
                        <p className="text-sm text-gray-600 mt-3 line-clamp-3">
                          {exp.description ||
                            "An unforgettable experience with certified guides and small groups."}
                        </p>
                      </div>

                      <div className="mt-5 flex items-center justify-between">
                        <div>
                          <p className="text-xs text-gray-500">Starting from</p>
                          <p className="text-lg font-bold text-gray-900">
                            ₹{exp.price}
                          </p>
                        </div>
                        <Link
                          to={`/details/${exp.id}`}
                          className="bg-yellow-400 hover:bg-yellow-500 text-black px-5 py-2 rounded-lg font-medium transition"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </section>
          )}
        </div>
      </div>
    </>
  );
}
