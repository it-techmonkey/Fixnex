'use client';

import React, { useState } from "react";
import { ServiceDropdown } from "./ServiceDropdown";
import { BookingFormData } from "@/lib/types";

interface FallbackFormProps {
  onSubmit: (data: BookingFormData) => void;
  isSubmitting?: boolean;
}

export const FallbackForm: React.FC<FallbackFormProps> = ({
  onSubmit,
  isSubmitting = false,
}) => {
  const [formData, setFormData] = useState<BookingFormData>({
    service: "",
    date: "",
    time: "",
    subscriber: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.service && formData.date && formData.time) {
      onSubmit(formData);
    }
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="bg-[#1a1a1a] border border-[#2C2C2C] rounded-2xl p-6 mt-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-[#DDDDDD] mb-2">
            Service *
          </label>
          <ServiceDropdown
            value={formData.service}
            onChange={(value) => setFormData({ ...formData, service: value })}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#DDDDDD] mb-2">
            Date *
          </label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) =>
              setFormData({ ...formData, date: e.target.value })
            }
            min={today}
            required
            className="w-full bg-[#0d0d0d] border border-[#2C2C2C] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#04438C] transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#DDDDDD] mb-2">
            Time *
          </label>
          <input
            type="time"
            value={formData.time}
            onChange={(e) =>
              setFormData({ ...formData, time: e.target.value })
            }
            required
            className="w-full bg-[#0d0d0d] border border-[#2C2C2C] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#04438C] transition-colors"
          />
        </div>

        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="subscriber"
            checked={formData.subscriber}
            onChange={(e) =>
              setFormData({ ...formData, subscriber: e.target.checked })
            }
            className="w-5 h-5 rounded border-[#2C2C2C] bg-[#0d0d0d] text-[#04438C] focus:ring-[#04438C] focus:ring-2"
          />
          <label htmlFor="subscriber" className="text-sm text-[#DDDDDD] cursor-pointer">
            I am a subscriber/member
          </label>
        </div>

        <button
          type="submit"
          disabled={
            isSubmitting || !formData.service || !formData.date || !formData.time
          }
          className="w-full bg-gradient-to-r from-[#2C2C2C] to-[#04438C] text-white rounded-lg px-6 py-3 font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Submitting..." : "Submit Booking"}
        </button>
      </form>
    </div>
  );
};

