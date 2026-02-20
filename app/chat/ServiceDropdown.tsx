'use client';

import React, { useState, useEffect } from "react";
import { Service } from "@/lib/types";

interface ServiceDropdownProps {
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}

export const ServiceDropdown: React.FC<ServiceDropdownProps> = ({
  value,
  onChange,
  required = false,
}) => {
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    fetch("/api/chat/services")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to load services");
        }
        return res.json();
      })
      .then((data: Service[]) => setServices(data))
      .catch((error) => {
        console.error("Error loading services:", error);
        setServices([]);
      });
  }, []);

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required={required}
      className="w-full bg-[#1a1a1a] border border-[#2C2C2C] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#04438C] transition-colors"
    >
      <option value="">Select a service...</option>
      {services.map((service, index) => (
        <option key={index} value={service.name}>
          {service.name}
        </option>
      ))}
    </select>
  );
};

