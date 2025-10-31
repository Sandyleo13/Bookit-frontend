import React from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

interface CalendarProps {
  selected: Date | undefined;
  onSelect: (date: Date | undefined) => void;
}

export const Calendar: React.FC<CalendarProps> = ({ selected, onSelect }) => {
  return (
    <div className="p-4 border rounded-2xl shadow-md bg-white">
      <DayPicker
        mode="single"
        selected={selected}
        onSelect={onSelect}
        // ⛔ Disable all dates before today
        disabled={{ before: new Date() }}
        fromDate={new Date()}
        className="rounded-md text-gray-800"
        styles={{
          caption: { color: "#000", fontWeight: "600" },
          head_cell: { color: "#111", fontWeight: "600" },
          day: { color: "#111" },
          day_selected: {
            backgroundColor: "#FACC15", // Tailwind yellow-400
            color: "#000",
            borderRadius: "8px",
          },
          day_today: {
            color: "#2563eb", // Tailwind blue-600
            fontWeight: "700",
          },
          day_disabled: {
            color: "#9ca3af", // Tailwind gray-400
            textDecoration: "line-through",
            cursor: "not-allowed",
            opacity: 0.5,
          },
        }}
      />
    </div>
  );
};
