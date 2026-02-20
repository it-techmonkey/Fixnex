'use client';

import React from "react";
import { ChatMessage } from "@/lib/types";

interface MessageBubbleProps {
  message: ChatMessage;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.sender === "user";

  return (
    <div
      className={`flex w-full mb-4 ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`max-w-[80%] md:max-w-[70%] rounded-2xl px-4 py-3 ${
          isUser
            ? "bg-gradient-to-r from-[#2C2C2C] to-[#04438C] text-white"
            : "bg-[#1a1a1a] text-[#DDDDDD] border border-[#2C2C2C]"
        }`}
      >
        <p className="text-sm md:text-base leading-relaxed whitespace-pre-wrap break-words">
          {message.text}
        </p>
        <span
          className={`text-xs mt-1 block ${
            isUser ? "text-[#AAAAAA]" : "text-[#888888]"
          }`}
        >
          {formatTime(message.timestamp)}
        </span>
      </div>
    </div>
  );
};

function formatTime(date: Date): string {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${minutes.toString().padStart(2, "0")} ${ampm}`;
}

