import { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import axios from "axios";

interface Experience {
  id: number;
  title: string;
  description: string;
  image: string;
  price: number;
}

export default function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const { experience: stateExperience, selectedDate, selectedTime } =
    location.state || {};

  const [experience, setExperience] = useState<Experience | null>(
    stateExperience || null
  );
  const [loading, setLoading] = useState(!stateExperience);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", email: "", promo: "" });
  const [discount, setDiscount] = useState(0);
  const [bookingId, setBookingId] = useState("");
  const [message, setMessage] = useState("");

  // ✅ Use environment base URL for backend
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // ✅ Generate booking ID
  useEffect(() => {
    setBookingId("BKG-" + Date.now());
  }, []);

  // ✅ Fetch experience if not passed from previous page
  useEffect(() => {
    if (!experience && id) {
      setLoading(true);
      fetch(`${API_BASE_URL}/api/experiences/${id}`)
        .then((res) => {
          if (!res.ok) throw new Error("Failed to load experience details.");
          return res.json();
        })
        .then((data) => setExperience(data))
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
    }
  }, [id, experience, API_BASE_URL]);

  // ✅ Dynamic title
  useEffect(() => {
    document.title = experience?.title
      ? `Checkout - ${experience.title} | BookIt`
      : "Checkout | BookIt";
  }, [experience]);

  // ✅ Apply promo code
  const handlePromo = () => {
    if (form.promo.trim().toLowerCase() === "hd10") {
      setDiscount(Math.round((experience?.price || 0) * 0.1));
      setMessage("✅ Promo code applied! 10% discount added.");
    } else {
      setDiscount(0);
      setMessage("❌ Invalid promo code.");
    }
  };

  // ✅ Submit booking
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    if (!experience) {
      setMessage("Experience not found. Please try again.");
      return;
    }

    if (!form.name || !form.email) {
      setMessage("Please fill in all required fields.");
      return;
    }

    const subtotal = experience.price;
    const taxes = Math.round(subtotal * 0.12);
    const total = subtotal + taxes - discount;

    // ✅ Send correct field names that backend expects
    const bookingData = {
      name: form.name,
      email: form.email,
      promo_code: form.promo || null,
      experience_id: experience.id,
      total_price: total,
      date:
        selectedDate instanceof Date
          ? selectedDate.toISOString().split("T")[0]
          : selectedDate || null,
      time: selectedTime || null,
    };

    console.log("📦 Sending booking data:", bookingData);

    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/bookings`,
        bookingData,
        { headers: { "Content-Type": "application/json" } }
      );

      console.log("✅ Booking created:", res.data);
      setMessage("✅ Booking confirmed!");

      navigate(`/result?success=true&id=${res.data.bookingId}`, {
        state: {
          bookingId: res.data.bookingId,
          experience,
          selectedDate,
          selectedTime,
          total,
        },
      });
    } catch (err: any) {
      console.error(
        "❌ Booking submission failed:",
        err.response?.data || err.message
      );
      setMessage(
        `❌ Booking failed: ${
          err.response?.data?.message || "Server error. Please try again."
        }`
      );
    }
  };

  // ✅ Loading State
  if (loading)
    return (
      <div className="flex items-center justify-center h-screen text-gray-600 text-lg">
        Loading checkout details...
      </div>
    );

  // ✅ Error or missing experience
  if (error || !experience)
    return (
      <div className="flex items-center justify-center h-screen text-red-600 text-lg">
        {error ||
          "No booking details found. Please go back and select an experience."}
      </div>
    );

  const subtotal = experience.price;
  const taxes = Math.round(subtotal * 0.12);
  const total = subtotal + taxes - discount;

  const displayDate =
    selectedDate instanceof Date
      ? selectedDate.toLocaleDateString("en-IN")
      : selectedDate || "—";

  const displayTime =
    typeof selectedTime === "string" && selectedTime !== ""
      ? selectedTime
      : "—";

  // ✅ UI
  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-10 grid md:grid-cols-2 gap-10">
      {/* Left Section - Form */}
      <div>
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-5"
        >
          <h3 className="text-2xl font-semibold text-gray-900 mb-2">
            Enter Your Details
          </h3>

          <input
            type="text"
            placeholder="Full Name"
            required
            className="w-full border rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"

            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <input
            type="email"
            placeholder="Email Address"
            required
            className="w-full border rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Promo Code (optional)"
              className="flex-1 border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              value={form.promo}
              onChange={(e) => setForm({ ...form, promo: e.target.value })}
            />
            <button
              type="button"
              onClick={handlePromo}
              className="px-5 py-3 bg-yellow-500 text-white font-medium rounded-lg hover:bg-yellow-600 transition"
            >
              Apply
            </button>
          </div>

          <button
            type="submit"
            className="bg-yellow-500 hover:bg-yellow-600 text-white w-full py-3 rounded-lg font-semibold text-lg transition"
          >
            Proceed to Payment
          </button>

          {message && (
            <p
              className={`text-center mt-3 font-medium ${
                message.includes("✅")
                  ? "text-green-600"
                  : message.includes("❌")
                  ? "text-red-600"
                  : "text-gray-700"
              }`}
            >
              {message}
            </p>
          )}
        </form>
      </div>

      {/* Right Section - Summary */}
      <div className="flex-1 bg-gray-100 rounded-2xl p-6 shadow-md border border-gray-200 h-fit sticky top-28">
        <h2 className="text-2xl font-semibold mb-4 text-gray-900">
          Booking Summary
        </h2>

        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {experience.title}
        </h3>

        <div className="space-y-3 text-gray-800">
          <div className="flex justify-between">
            <span>Booking ID</span>
            <span className="font-medium">{bookingId}</span>
          </div>

          <div className="flex justify-between">
            <span>Date</span>
            <span>{displayDate}</span>
          </div>

          <div className="flex justify-between">
            <span>Time</span>
            <span>{displayTime}</span>
          </div>

          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>₹{subtotal}</span>
          </div>

          <div className="flex justify-between">
            <span>Taxes & Fees (12%)</span>
            <span>₹{taxes}</span>
          </div>

          <div className="flex justify-between">
            <span>Discount</span>
            <span className={discount ? "text-green-600 font-medium" : ""}>
              {discount ? `- ₹${discount}` : "—"}
            </span>
          </div>

          <hr className="border-gray-300 my-3" />

          <div className="flex justify-between text-lg font-semibold text-gray-900">
            <span>Total</span>
            <span>₹{total}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
