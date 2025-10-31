import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";

interface BookingData {
  bookingId?: string;
  name?: string;
  email?: string;
  total_price?: number;
  experience_id?: number;
  date?: string;
  time?: string;
}

export default function Result() {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const success = query.get("success") === "true";
  const bookingId = query.get("id");

  const [booking, setBooking] = useState<BookingData | null>(null);
  const [loading, setLoading] = useState(success && !!bookingId);
  const [error, setError] = useState("");

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // ✅ Fetch booking details if success
  useEffect(() => {
    const fetchBooking = async () => {
      if (success && bookingId) {
        try {
          const res = await fetch(`${API_BASE_URL}/api/bookings/${bookingId}`);
          if (!res.ok) throw new Error("Failed to load booking details");
          const data = await res.json();
          setBooking(data);
        } catch (err) {
          setError(
            err instanceof Error
              ? err.message
              : "Something went wrong fetching booking details"
          );
        } finally {
          setLoading(false);
        }
      }
    };

    fetchBooking();
  }, [success, bookingId, API_BASE_URL]);

  if (!success) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] text-center px-6">
        <h1 className="text-4xl font-bold text-red-600 mb-4">Booking Failed ❌</h1>
        <p className="text-gray-600 mb-6">
          Something went wrong. Please try again or contact support.
        </p>
        <Link
          to="/"
          className="bg-yellow-400 text-black px-5 py-2 rounded-md font-medium hover:bg-yellow-500"
        >
          Back to Home
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] text-center px-6 text-gray-600">
        Loading booking details...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] text-center px-6 text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-[80vh] text-center px-6">
      <h1 className="text-4xl font-bold text-green-600 mb-4">Booking Confirmed 🎉</h1>
      <p className="text-gray-700 mb-6">
        Your experience has been successfully booked!
      </p>

      {booking && (
        <div className="bg-white shadow-md rounded-2xl p-6 border border-gray-200 mb-6 text-left max-w-md w-full">
          <p className="text-gray-700"><strong>Booking ID:</strong> {booking.bookingId}</p>
          <p className="text-gray-700"><strong>Name:</strong> {booking.name}</p>
          <p className="text-gray-700"><strong>Email:</strong> {booking.email}</p>
          <p className="text-gray-700"><strong>Total Paid:</strong> ₹{booking.total_price}</p>
          {booking.date && (
            <p className="text-gray-700"><strong>Date:</strong> {booking.date}</p>
          )}
          {booking.time && (
            <p className="text-gray-700"><strong>Time:</strong> {booking.time}</p>
          )}
        </div>
      )}

      <Link
        to="/"
        className="bg-yellow-400 text-black px-5 py-2 rounded-md font-medium hover:bg-yellow-500 transition"
      >
        Back to Home
      </Link>
    </div>
  );
}
