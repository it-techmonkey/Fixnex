import {
  ConversationState,
  ChatResponse,
  PatternMatchResult,
  Booking,
} from "@/lib/types";
import { matchPattern } from "@/lib/patternMatcher";
import fs from "fs";
import path from "path";

const conversationStates: Map<string, ConversationState> = new Map();
const failedServiceAttempts: Map<string, number> = new Map();

function getConversationState(sessionId: string): ConversationState {
  if (!conversationStates.has(sessionId)) {
    conversationStates.set(sessionId, {
      sessionId,
      service: null,
      date: null,
      time: null,
      subscriber: null,
      expecting: null,
      messages: [],
    });
  }
  return conversationStates.get(sessionId)!;
}

export function processMessage(
  message: string,
  sessionId: string,
): ChatResponse {
  const state = getConversationState(sessionId);
  const expectingService = !state.service || state.expecting === "service";
  const match = matchPattern(message, expectingService);

  if (!state.service) {
    const currentAttempts = failedServiceAttempts.get(sessionId) || 0;

    if (match.service) {
      failedServiceAttempts.set(sessionId, 0);
      state.service = match.service;
    } else {
      if (state.expecting === "service" || state.expecting === null) {
        failedServiceAttempts.set(sessionId, currentAttempts + 1);
      }
    }
  } else if (match.service && match.service !== state.service) {
    if (match.confidence && match.confidence > 0.3 && state.expecting === "service") {
      state.service = match.service;
    }
  }

  if (match.date) {
    state.date = match.date;
  }
  if (match.time) {
    state.time = match.time;
  }
  if (match.subscriber !== undefined) {
    state.subscriber = match.subscriber;
  }

  if (!state.service) {
    state.expecting = "service";
    const attempts = failedServiceAttempts.get(sessionId) || 0;

    if (attempts >= 2) {
      return {
        reply: "Let me take some details to help you better:",
        expecting: "service",
        showForm: true,
      };
    }

    return {
      reply:
        "I'd be happy to help you book a service! What service are you looking for?",
      expecting: "service",
      showForm: false,
    };
  }

  if (!state.date) {
    state.expecting = "date";
    return {
      reply: `Great! I found ${state.service}. What date would you prefer?`,
      expecting: "date",
      showForm: false,
      service: state.service,
    };
  }

  if (!state.time) {
    state.expecting = "time";
    return {
      reply: `Perfect! For ${state.service} on ${formatDateDisplay(
        state.date,
      )}. What time works best for you?`,
      expecting: "time",
      showForm: false,
      service: state.service,
      date: state.date,
    };
  }

  if (state.subscriber === null) {
    state.expecting = "subscriber";
    return {
      reply: `Excellent! ${state.service} on ${formatDateDisplay(
        state.date,
      )} at ${state.time}. Are you a subscriber/member?`,
      expecting: "subscriber",
      showForm: false,
      service: state.service,
      date: state.date,
      time: state.time,
    };
  }

  state.expecting = "complete";
  const booking = saveBooking(state);

  conversationStates.delete(sessionId);
  failedServiceAttempts.delete(sessionId);

  return {
    reply: `Perfect! Your booking for ${booking.service} on ${formatDateDisplay(
      booking.date,
    )} at ${booking.time} has been confirmed. ${
      booking.subscriber ? "Member pricing will apply." : "Standard pricing will apply."
    } Thank you!`,
    expecting: "complete",
    showForm: false,
    service: booking.service,
    date: booking.date,
    time: booking.time,
    subscriber: booking.subscriber,
  };
}

function saveBooking(state: ConversationState): Booking {
  const booking: Booking = {
    service: state.service!,
    date: state.date!,
    time: state.time!,
    subscriber: state.subscriber!,
    timestamp: new Date().toISOString(),
  };

  const bookingsPath = path.join(process.cwd(), "data", "bookings.json");

  let bookings: Booking[] = [];
  if (fs.existsSync(bookingsPath)) {
    try {
      const data = fs.readFileSync(bookingsPath, "utf-8");
      bookings = JSON.parse(data);
    } catch (error) {
      console.error("Error reading bookings.json:", error);
      bookings = [];
    }
  }

  bookings.push(booking);

  try {
    fs.writeFileSync(bookingsPath, JSON.stringify(bookings, null, 2), "utf-8");
  } catch (error) {
    console.error("Error writing bookings.json:", error);
  }

  return booking;
}

function formatDateDisplay(dateString: string): string {
  const date = new Date(dateString + "T00:00:00");
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function handleFormSubmission(
  service: string,
  date: string,
  time: string,
  subscriber: boolean,
  sessionId: string,
): ChatResponse {
  const booking: Booking = {
    service,
    date,
    time,
    subscriber,
    timestamp: new Date().toISOString(),
  };

  const bookingsPath = path.join(process.cwd(), "data", "bookings.json");

  let bookings: Booking[] = [];
  if (fs.existsSync(bookingsPath)) {
    try {
      const data = fs.readFileSync(bookingsPath, "utf-8");
      bookings = JSON.parse(data);
    } catch (error) {
      console.error("Error reading bookings.json:", error);
      bookings = [];
    }
  }

  bookings.push(booking);

  try {
    fs.writeFileSync(bookingsPath, JSON.stringify(bookings, null, 2), "utf-8");
  } catch (error) {
    console.error("Error writing bookings.json:", error);
  }

  conversationStates.delete(sessionId);
  failedServiceAttempts.delete(sessionId);

  return {
    reply: `Perfect! Your booking for ${service} on ${formatDateDisplay(
      date,
    )} at ${time} has been confirmed. ${
      subscriber ? "Member pricing will apply." : "Standard pricing will apply."
    } Thank you!`,
    expecting: "complete",
    showForm: false,
    service,
    date,
    time,
    subscriber,
  };
}

export function shouldShowFallbackForm(sessionId: string): boolean {
  const state = getConversationState(sessionId);
  const attempts = failedServiceAttempts.get(sessionId) || 0;

  return attempts >= 2 && !state.service;
}

