// src/components/ui/time-selector.tsx
import React from "react";

interface TimeSelectorProps {
  times: string[];
  selectedTime: string | null;
  onSelect: (time: string) => void;
}

export const TimeSelector: React.FC<TimeSelectorProps> = ({
  times,
  selectedTime,
  onSelect,
}) => {
  return (
    <div className="mt-4">
      <h3 className="font-semibold text-lg mb-2">Select Time</h3>
      <div className="grid grid-cols-3 gap-3">
        {times.map((time) => (
          <button
            key={time}
            onClick={() => onSelect(time)}
            className={`border rounded-lg py-2 px-4 transition ${
              selectedTime === time
                ? "bg-yellow-500 text-white border-yellow-500"
                : "bg-white hover:bg-yellow-100"
            }`}
          >
            {time}
          </button>
        ))}
      </div>
    </div>
  );
};
