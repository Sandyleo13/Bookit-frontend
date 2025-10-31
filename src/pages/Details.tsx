import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar } from "@/components/ui/calendar";

interface Slot {
  date: string;
  available: boolean;
}

interface Experience {
  id: number;
  title: string;
  description: string;
  image: string;
  price: number | string;
  slots?: Slot[] | string[];
}

export default function Details() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [experience, setExperience] = useState<Experience | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState<string>("");

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // ✅ Fetch Experience
  useEffect(() => {
    const fetchExperience = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE_URL}/api/experiences/${id}`);
        if (!res.ok) throw new Error("Failed to fetch experience data.");
        const data = await res.json();
        setExperience(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unexpected error occurred."
        );
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchExperience();
  }, [id, API_BASE_URL]);

  // ✅ Update Page Title
  useEffect(() => {
    document.title = experience?.title
      ? `${experience.title} | Explore Experiences`
      : "Experience Details | Explore Experiences";
  }, [experience]);

  // ✅ Handle Checkout Navigation
  const handleContinue = () => {
    if (!selectedDate) return alert("Please select a date before continuing.");
    if (!selectedTime) return alert("Please select a time before continuing.");
    navigate("/checkout", {
      state: { id, selectedDate, selectedTime, experience },
    });
  };

  // ✅ Loading / Error States
  if (loading)
    return (
      <div className="text-center py-20 text-gray-600">
        Loading details...
      </div>
    );

  if (error)
    return (
      <div className="text-center py-20 text-red-500">
        {error}. Please try again later.
      </div>
    );

  if (!experience)
    return (
      <div className="text-center py-20 text-gray-600">
        Experience not found.
      </div>
    );

  // ✅ Price Calculation
  const basePrice = Number(experience.price) || 0;
  const tax = basePrice * 0.12;
  const totalPrice = basePrice + tax;

  // ✅ Time Slots
  const timeSlots =
    experience.slots && experience.slots.length > 0
      ? experience.slots.map((slot) =>
          typeof slot === "string"
            ? slot
            : new Date(slot.date).toLocaleTimeString("en-IN", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              })
        )
      : ["09:00 AM", "11:00 AM", "01:00 PM", "03:00 PM", "05:00 PM"];

  // ✅ Smart Image Handling
  const validImage =
    experience.image &&
    (experience.image.startsWith("http") ||
      experience.image.startsWith("/uploads/"));

  const imageUrl = validImage
    ? experience.image
    : `${API_BASE_URL}/${experience.image || ""}`;

  const fallbackBanner =
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80";

  const displayImage =
    imageUrl && !imageUrl.includes("undefined") ? imageUrl : fallbackBanner;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-6xl mx-auto px-4 md:px-8 py-10 bg-gray-50"
    >
      {/* ✅ Banner Section */}
      <div className="relative w-full h-72 md:h-96 mb-10 overflow-hidden rounded-2xl shadow-lg">
        <img
          src={displayImage}
          alt={experience.title}
          className="w-full h-full object-cover brightness-90 scale-105 transform transition-all duration-700 hover:scale-110"
          onError={(e) => {
            (e.target as HTMLImageElement).src = fallbackBanner;
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent backdrop-blur-[1px]" />
        <div className="absolute bottom-6 left-6 text-white">
          <h1 className="text-3xl md:text-4xl font-bold drop-shadow-lg">
            {experience.title}
          </h1>
          <p className="text-sm md:text-base mt-2 max-w-lg text-gray-200 leading-relaxed">
            {experience.description}
          </p>
        </div>
      </div>

      {/* ✅ Main Content */}
      <div className="grid md:grid-cols-2 gap-10 items-start">
        {/* Date & Time Selection */}
        <div>
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Select Date
            </h2>
            <div className="flex justify-center items-center border border-gray-100 rounded-xl p-3 bg-gray-50">
              <div className="rounded-lg bg-white shadow-inner">
                <Calendar selected={selectedDate} onSelect={setSelectedDate} />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Select Time
            </h2>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
              {timeSlots.map((time) => (
                <button
                  key={time}
                  onClick={() => setSelectedTime(time)}
                  className={`px-4 py-2.5 text-sm rounded-lg font-medium border transition-all duration-200 ${
                    selectedTime === time
                      ? "bg-yellow-500 text-white border-yellow-500 shadow-sm"
                      : "bg-white border-gray-300 text-gray-800 hover:bg-yellow-50"
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ✅ Price Summary + Checkout Button */}
        <div className="bg-white p-6 rounded-2xl border border-gray-300 shadow-md sticky top-28 h-fit">
          <h3 className="text-xl font-semibold mb-5 text-gray-900">
            Price Summary
          </h3>

          <div className="space-y-3 text-gray-800">
            <div className="flex justify-between">
              <span>Base Price</span>
              <span>₹{basePrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Taxes & Fees (12%)</span>
              <span>₹{tax.toFixed(2)}</span>
            </div>
          </div>

          <hr className="my-4 border-gray-300" />

          <div className="flex justify-between font-semibold text-lg text-gray-900 mb-6">
            <span>Total</span>
            <span>₹{totalPrice.toFixed(2)}</span>
          </div>

          <button
            onClick={handleContinue}
            className="w-full py-3 bg-yellow-500 text-white font-semibold rounded-lg hover:bg-yellow-600 transition"
          >
            Continue to Checkout
          </button>
        </div>
      </div>
    </motion.div>
  );
}
