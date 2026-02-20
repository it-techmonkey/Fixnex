"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Footer from "../components/layout/Footer";
import Header from "../components/layout/Header";
import { MessageBubble } from "./MessageBubble";
import { ChatMessage } from "@/lib/types";

type BookingStep = "idle" | "location" | "serviceType" | "date" | "time";

type ServiceSuggestion = {
  id: string;
  name: string;
  normal_price: string;
  member_price: string;
  category: {
    id: string;
    name: string;
  };
};

type CategoryInfo = {
  id: string;
  name: string;
  normalizedName: string;
  tokens: string[];
};

type SessionState = {
  loading: boolean;
  isAuthenticated: boolean;
  userId?: string;
};

type BookingCartItemRecord = {
  id: string;
  booking_id?: string | null;
  cart?: {
    id?: string | null;
    user_id?: string | null;
  } | null;
  services?: {
    id: string;
    name?: string;
  } | null;
  price?: string | null;
  location?: string | null;
  service_type?: string | null;
  time_slot?: string | null;
  scheduled_date?: string | null;
};

const SERVICE_TYPES = ["Standard Service", "Premium Service", "Emergency Service"];

const TIME_SLOTS = [
  "8:00 AM - 10:00 AM",
  "10:00 AM - 12:00 PM",
  "12:00 PM - 2:00 PM",
  "2:00 PM - 4:00 PM",
  "4:00 PM - 6:00 PM",
  "6:00 PM - 8:00 PM",
];

const STOP_WORDS = new Set([
  "the",
  "what",
  "which",
  "services",
  "service",
  "offer",
  "offers",
  "do",
  "you",
  "have",
  "need",
  "for",
  "and",
  "with",
  "about",
  "tell",
  "me",
  "please",
  "help",
  "my",
  "a",
  "an",
  "to",
  "is",
  "in",
  "of",
  "on",
  "at",
]);

const normalizeText = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const tokenize = (value: string) =>
  normalizeText(value)
    .split(" ")
    .filter((token) => token.length > 2 && !STOP_WORDS.has(token));

const computeTokenScore = (messageTokens: Set<string>, candidateTokens: string[]) => {
  if (!candidateTokens.length) return 0;
  let score = 0;
  candidateTokens.forEach((token) => {
    if (messageTokens.has(token)) {
      score += 6;
    } else {
      for (const messageToken of messageTokens) {
        if (
          messageToken.length > 4 &&
          (messageToken.includes(token) || token.includes(messageToken))
        ) {
          score += 3;
          break;
        }
      }
    }
  });
  return score;
};

const Page = () => {
  const router = useRouter();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "initial",
      text: "Hello! I'm Nex AI. Describe your issue or ask about our services, and I'll help you find the right option.",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingServices, setIsFetchingServices] = useState(false);
  const [serviceResults, setServiceResults] = useState<ServiceSuggestion[]>([]);
  const [awaitingServiceSelection, setAwaitingServiceSelection] = useState(false);
  const [bookingStep, setBookingStep] = useState<BookingStep>("idle");
  const [selectedService, setSelectedService] = useState<ServiceSuggestion | null>(null);
  const [bookingData, setBookingData] = useState({
    location: "",
    serviceType: "",
    date: "",
    timeSlot: "",
  });
  const [quickReplies, setQuickReplies] = useState<string[]>([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [datePickerValue, setDatePickerValue] = useState("");
  const [isBotThinking, setIsBotThinking] = useState(false);
  const [categories, setCategories] = useState<CategoryInfo[]>([]);
  const [servicesCatalog, setServicesCatalog] = useState<ServiceSuggestion[]>([]);
  const [awaitingCategorySelection, setAwaitingCategorySelection] = useState(false);
  const [session, setSession] = useState<SessionState>({
    loading: true,
    isAuthenticated: false,
    userId: undefined,
  });
  const [requiresLogin, setRequiresLogin] = useState(false);
  const [hasStartedConversation, setHasStartedConversation] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const botDelayRef = useRef(0);
  const botPendingCountRef = useRef(0);
  const hasPromptedLoginRef = useRef(false);

  const retrieveSession = useCallback(async (): Promise<SessionState> => {
    try {
      const response = await fetch("/api/auth/session", {
        method: "GET",
        credentials: "include",
        headers: {
          Accept: "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json().catch(() => null);
        const userId = data?.user?.id;
        return { loading: false, isAuthenticated: true, userId };
      }

      return { loading: false, isAuthenticated: false, userId: undefined };
    } catch (error) {
      console.error("Failed to fetch session:", error);
      return { loading: false, isAuthenticated: false, userId: undefined };
    }
  }, []);

  const inputPlaceholder = useMemo(() => {
    if (requiresLogin) {
      return "Log in to start chatting";
    }
    switch (bookingStep) {
      case "location":
        return "Share the location for this service";
      case "serviceType":
        return "Pick a service type or type your preference";
      case "date":
        return "Enter your preferred date (DD-MM-YYYY or YYYY-MM-DD)";
      case "time":
        return "Choose a time slot or type a suitable time";
      default:
        return "Describe your problem or ask about our services";
    }
  }, [bookingStep, requiresLogin]);

  useEffect(() => {
    let cancelled = false;

    const loadSession = async () => {
      const nextSession = await retrieveSession();
      if (!cancelled) {
        setSession(nextSession);
      }
    };

    loadSession();

    return () => {
      cancelled = true;
    };
  }, [retrieveSession]);

  useEffect(() => {
    if (session.loading) {
      return;
    }

    if (!session.isAuthenticated) {
      setRequiresLogin(true);
      if (!hasPromptedLoginRef.current) {
        hasPromptedLoginRef.current = true;
        setQuickReplies(["Log in now"]);
        addMessage(
          "Please log in to start chatting and booking services. Tap below to sign in.",
          "bot"
        );
      }
    } else {
      setRequiresLogin(false);
      hasPromptedLoginRef.current = false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session.loading, session.isAuthenticated]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, serviceResults, quickReplies]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/services");
        if (!response.ok) throw new Error("Failed to fetch services");
        const data = await response.json();
        if (!Array.isArray(data.services)) return;

        setServicesCatalog(data.services);

        const categoryMap = new Map<string, CategoryInfo>();
        data.services.forEach((service: ServiceSuggestion) => {
          const category = service.category;
          if (!category?.id || !category.name) return;
          if (categoryMap.has(category.id)) return;

          const normalizedName = normalizeText(category.name);
          categoryMap.set(category.id, {
            id: category.id,
            name: category.name,
            normalizedName,
            tokens: tokenize(category.name),
          });
        });

        setCategories(Array.from(categoryMap.values()));
      } catch (error) {
        console.error("Failed to load categories", error);
      }
    };

    fetchCategories();
  }, []);

  const addMessage = (
    text: string,
    sender: "user" | "bot",
    options: { delayMs?: number; onDelivered?: () => void } = {}
  ) => {
    if (sender === "user") {
      setHasStartedConversation(true);
    }

    if (sender === "bot") {
      const baseDelay =
        options.delayMs !== undefined
          ? options.delayMs
          : 4000 + Math.floor(Math.random() * 600);

      botPendingCountRef.current += 1;
      const scheduledDelay = botDelayRef.current + baseDelay;
      botDelayRef.current = scheduledDelay;
      setIsBotThinking(true);

      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
            text,
            sender,
            timestamp: new Date(),
          },
        ]);

        options.onDelivered?.();

        botPendingCountRef.current -= 1;
        if (botPendingCountRef.current <= 0) {
          botDelayRef.current = 0;
          setIsBotThinking(false);
        }
      }, scheduledDelay);

      return;
    }

    setMessages((prev) => [
      ...prev,
      {
        id: `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        text,
        sender,
        timestamp: new Date(),
      },
    ]);
    if (sender === "user") {
      setHasStartedConversation(true);
    }
    options.onDelivered?.();
  };

  const [isConfirmingBooking, setIsConfirmingBooking] = useState(false);

  const resetBookingState = () => {
    setBookingStep("idle");
    setSelectedService(null);
    setBookingData({
      location: "",
      serviceType: "",
      date: "",
      timeSlot: "",
    });
    setQuickReplies([]);
    setShowDatePicker(false);
    setIsConfirmingBooking(false);
  };

  const showCategoryOptions = (introMessage?: string) => {
    if (!categories.length) {
      addMessage(
        "We offer a wide range of services across maintenance, cleaning, repairs, and more. I'm fetching the detailed list—feel free to search for any specific service in the meantime!",
        "bot"
      );
      return;
    }

    const message =
      introMessage ?? "Tap a category below to explore matching services.";

    setQuickReplies([]);
    setAwaitingCategorySelection(false);

    addMessage(message, "bot", {
      onDelivered: () => {
        setQuickReplies([]);
        setAwaitingCategorySelection(true);
      },
    });
  };

  const findKeyword = (message: string) => {
    const normalizedMessage = normalizeText(message);
    const messageTokens = new Set(tokenize(message));

    let bestMatch: { term: string; score: number } = { term: "", score: 0 };

    const considerCandidate = (term: string, score: number) => {
      if (!term || score <= 0) return;
      if (score > bestMatch.score) {
        bestMatch = { term, score };
      }
    };

    categories.forEach((category) => {
      let score = 0;
      if (category.normalizedName && normalizedMessage.includes(category.normalizedName)) {
        score += 80;
      }
      score += computeTokenScore(messageTokens, category.tokens);
      considerCandidate(category.name, score);
    });

    servicesCatalog.forEach((service) => {
      const serviceName = service.name;
      const normalizedServiceName = normalizeText(serviceName);
      let score = 0;
      if (normalizedServiceName && normalizedMessage.includes(normalizedServiceName)) {
        score += 120;
      }
      score += computeTokenScore(messageTokens, tokenize(serviceName));

      if (service.category?.name) {
        const categoryTokens = tokenize(service.category.name);
        score += computeTokenScore(messageTokens, categoryTokens);
        if (
          normalizeText(service.category.name) &&
          normalizedMessage.includes(normalizeText(service.category.name))
        ) {
          score += 40;
        }
      }

      considerCandidate(serviceName, score);
    });

    if (bestMatch.score > 0) {
      return bestMatch.term;
    }

    const fallbackToken = Array.from(messageTokens).sort(
      (a, b) => b.length - a.length
    )[0];

    if (fallbackToken) {
      return fallbackToken;
    }

    return message.trim();
  };

  const shouldListCategories = (message: string) => {
    const normalized = message.toLowerCase();
    return (
      normalized.includes("what services") ||
      normalized.includes("services do you offer") ||
      normalized.includes("service categories") ||
      normalized.includes("what do you offer") ||
      (normalized.includes("services") && normalized.includes("list"))
    );
  };

  const fetchServices = async ({
    searchTerm,
    categoryId,
    categoryName,
  }: {
    searchTerm?: string;
    categoryId?: string;
    categoryName?: string;
  }) => {
    setIsFetchingServices(true);
    setServiceResults([]);
    setQuickReplies([]);
    setAwaitingServiceSelection(false);
    setAwaitingCategorySelection(false);

    try {
      const params = new URLSearchParams();
      if (searchTerm) {
        params.append("search", searchTerm);
      }
      if (categoryId) {
        params.append("categoryId", categoryId);
      } else if (categoryName) {
        params.append("category", categoryName);
      }

      const response = await fetch(
        params.toString() ? `/api/services?${params.toString()}` : `/api/services`,
        {
          credentials: "include",
          headers: {
            "Accept": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch services");
      }

      const data = await response.json();
      if (Array.isArray(data.services) && data.services.length > 0) {
        setServiceResults(data.services);

        const message = searchTerm
          ? `Here are the services I found for "${searchTerm}". Tap on the one that fits your need:`
          : categoryName
            ? `Here are the services we offer under "${categoryName}". Choose one to continue:`
            : "Here are some services you can choose from. Pick the one that fits best:";

        addMessage(message, "bot", {
          onDelivered: () => {
            setAwaitingCategorySelection(false);
            setQuickReplies([]);
            setAwaitingServiceSelection(true);
          },
        });

        return true;
      } else {
        const message = searchTerm
          ? `I couldn't find a service that matches your search right now. Tap a category below to explore other options.`
          : "I couldn't find services for that selection. Tap a category below to browse.";

        showCategoryOptions(message);
        return false;
      }
    } catch (error) {
      console.error("Service search error:", error);
      addMessage(
        "I'm having trouble reaching the services catalogue at the moment. Please try again shortly.",
        "bot"
      );
      return false;
    } finally {
      setIsFetchingServices(false);
      setIsLoading(false);
    }
  };

  const fetchServiceByName = async (serviceName: string) => {
    try {
      const response = await fetch(
        `/api/services?search=${encodeURIComponent(serviceName)}`,
        {
          credentials: "include",
          headers: {
            "Accept": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch service details");
      }
      const data = await response.json();
      if (Array.isArray(data.services)) {
        return (
          data.services.find(
            (candidate: ServiceSuggestion) =>
              normalizeText(candidate.name) === normalizeText(serviceName)
          ) ?? data.services[0] ?? null
        );
      }
    } catch (error) {
      console.error("Service detail fetch error:", error);
    }
    return null;
  };

  const ensureCartId = async (userId: string): Promise<string | null> => {
    let cartId: string | null = null;

    try {
      const itemsResponse = await fetch(`/api/booking-cart-items`, {
        method: "GET",
        credentials: "include",
        headers: {
          Accept: "application/json",
        },
      });

      if (itemsResponse.ok) {
        const payload = await itemsResponse.json().catch(() => null);
        const items = Array.isArray(payload?.items)
          ? (payload.items as BookingCartItemRecord[])
          : [];

        const matchingItem = items.find(
          (item) => item?.cart?.user_id === userId && !item.booking_id && item.cart?.id
        );

        if (matchingItem?.cart?.id) {
          cartId = matchingItem.cart.id ?? null;
        }
      }
    } catch (error) {
      console.error("Failed to fetch booking cart items:", error);
    }

    if (!cartId) {
      try {
        const cartResponse = await fetch(`/api/cart/${userId}`, {
          method: "GET",
          credentials: "include",
          headers: {
            Accept: "application/json",
          },
        });

        if (cartResponse.ok) {
          const cartPayload = await cartResponse.json().catch(() => null);
          if (cartPayload?.cart?.id) {
            cartId = cartPayload.cart.id;
          }
        }
      } catch (error) {
        console.error("Failed to fetch cart detail:", error);
      }
    }

    if (!cartId) {
      try {
        const createCartResponse = await fetch(`/api/cart/${userId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ serviceIds: [] }),
        });

        if (createCartResponse.ok) {
          const createdCart = await createCartResponse.json().catch(() => null);
          if (createdCart?.cart?.id) {
            cartId = createdCart.cart.id;
          }
        }
      } catch (error) {
        console.error("Failed to initialize cart:", error);
      }
    }

    return cartId;
  };

  const formatDisplayDate = (value: string | null | undefined) => {
    if (!value) {
      return "TBD";
    }

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getPriceDisplay = (value: string | number | null | undefined) => {
    if (value === null || value === undefined) {
      return "TBD";
    }

    if (typeof value === "number") {
      return `AED ${value.toFixed(2)}`;
    }

    return value;
  };

  const startBookingFlow = (service: ServiceSuggestion) => {
    setSelectedService(service);
    setBookingStep("location");
    setBookingData((prev) => ({
      ...prev,
      location: "",
      serviceType: "",
      date: "",
      timeSlot: "",
    }));
    setQuickReplies([]);
    setShowDatePicker(false);
    addMessage(
      `Great choice! "${service.name}" from the ${service.category?.name ?? "selected"} category it is.`,
      "bot",
      {
        onDelivered: () => {
          addMessage(
            "To schedule it, could you share the location for this service?",
            "bot",
            { delayMs: 600 }
          );
        },
      }
    );
  };

  const handleBookingStep = (userInput: string) => {
    switch (bookingStep) {
      case "location": {
        setBookingData((prev) => ({ ...prev, location: userInput }));
        setBookingStep("serviceType");
        setQuickReplies([]);
        addMessage(
          "Thanks! Which service type suits you? You can pick one below or type your own preference.",
          "bot",
          {
            onDelivered: () => setQuickReplies(SERVICE_TYPES),
          }
        );
        break;
      }
      case "serviceType": {
        setBookingData((prev) => ({ ...prev, serviceType: userInput }));
        setBookingStep("date");
        setQuickReplies([]);
        setShowDatePicker(false);
        addMessage(
          "Perfect. What date would you like us to visit? (DD-MM-YYYY or YYYY-MM-DD)",
          "bot",
          {
            onDelivered: () => {
              setQuickReplies([]);
              setShowDatePicker(true);
            },
          }
        );
        break;
      }
      case "date": {
        setBookingData((prev) => ({ ...prev, date: userInput }));
        setBookingStep("time");
        setQuickReplies([]);
        setShowDatePicker(false);
        addMessage(
          "Almost done! Pick a time slot from below, or type a preferred time.",
          "bot",
          {
            onDelivered: () => setQuickReplies(TIME_SLOTS),
          }
        );
        break;
      }
      case "time": {
        const updatedData = {
          ...bookingData,
          timeSlot: userInput,
        };
        setBookingData(updatedData);
        setBookingStep("idle");
        setQuickReplies([]);
        setShowDatePicker(false);
        addMessage(
          `All set! Here's a summary:\n• Service: ${selectedService?.name}\n• Location: ${updatedData.location}\n• Service Type: ${updatedData.serviceType}\n• Date: ${new Date(updatedData.date).toLocaleDateString("en-GB")}\n• Time Slot: ${updatedData.timeSlot}\n\nWould you like me to confirm this booking for you?`,
          "bot",
          {
            onDelivered: () => {
              setQuickReplies(["Confirm Booking", "Make Changes", "Cancel"]);
              setIsConfirmingBooking(true);
            },
          }
        );
        break;
      }
      default:
        break;
    }
  };

  const finalizeBooking = async () => {
    if (!selectedService) {
      addMessage(
        "I couldn't find the selected service anymore. Let's start over so I can help you book the right one.",
        "bot"
      );
      resetBookingState();
      return;
    }

    let activeSession = session;
    if (activeSession.loading) {
      activeSession = await retrieveSession();
      setSession(activeSession);
    }

    if (!activeSession.isAuthenticated || !activeSession.userId) {
      setIsLoading(false);
       setIsConfirmingBooking(false);
      addMessage(
        "It looks like you're not signed in. Please log in so I can complete the booking for you.",
        "bot",
        {
          onDelivered: () => setQuickReplies(["Log in now", "Cancel"]),
        }
      );
      return;
    }

    setIsLoading(true);
    addMessage("Great! Give me a moment while I lock in that booking for you.", "bot");

    try {
      const cartId = await ensureCartId(activeSession.userId);
      if (!cartId) {
        throw new Error("Unable to locate your cart.");
      }

      const scheduledDateISO = bookingData.date
        ? new Date(bookingData.date).toISOString()
        : null;
      const priceValue =
        selectedService.normal_price !== undefined && selectedService.normal_price !== null
          ? String(selectedService.normal_price)
          : null;

      const cartItemResponse = await fetch(`/api/booking-cart-items`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          cartId,
          serviceId: selectedService.id,
          categoryName: selectedService.category?.name ?? null,
          location: bookingData.location || null,
          serviceType: bookingData.serviceType || null,
          scheduledDate: scheduledDateISO,
          timeSlot: bookingData.timeSlot || null,
          price: priceValue,
        }),
      });

      const cartItemPayload = await cartItemResponse.json().catch(() => null);
      if (!cartItemResponse.ok || !cartItemPayload?.item?.id) {
        throw new Error(
          cartItemPayload?.message ?? "Failed to add the service details to your cart."
        );
      }

      const bookingResponse = await fetch(`/api/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          bookingCartItemIds: [cartItemPayload.item.id as string],
          userId: activeSession.userId,
          categoryName: selectedService.category?.name ?? null,
          location: bookingData.location || null,
          serviceType: bookingData.serviceType || null,
          scheduledDate: scheduledDateISO,
          timeSlot: bookingData.timeSlot || null,
          price: priceValue,
        }),
      });

      const bookingPayload = await bookingResponse.json().catch(() => null);
      if (!bookingResponse.ok || !bookingPayload?.booking?.id) {
        throw new Error(bookingPayload?.message ?? "Failed to create the booking.");
      }

      const bookingRecord = bookingPayload.booking as {
        id: string;
        location?: string | null;
        service_type?: string | null;
        scheduled_date?: string | null;
        time_slot?: string | null;
        price?: string | null;
      };

      const displayDate = formatDisplayDate(
        bookingRecord.scheduled_date ?? scheduledDateISO
      );
      const displayTime = bookingRecord.time_slot ?? bookingData.timeSlot ?? "TBD";
      const displayLocation = bookingRecord.location ?? bookingData.location ?? "TBD";
      const displayPrice = getPriceDisplay(bookingRecord.price ?? priceValue);

      addMessage(
        `✅ Booking confirmed!\n• Booking ID: ${bookingRecord.id}\n• Service: ${selectedService.name}\n• When: ${displayDate} at ${displayTime}\n• Location: ${displayLocation}\n• Total: ${displayPrice}\n\nYou'll receive a confirmation shortly. Need help with anything else?`,
        "bot",
        {
          onDelivered: () => {
            resetBookingState();
            setQuickReplies(["Book another service", "View my bookings"]);
          },
        }
      );
    } catch (error) {
      console.error("Finalize booking error:", error);
      addMessage(
        "I'm sorry—something went wrong while confirming your booking. Please try again in a moment or adjust the details.",
        "bot"
      );
      setIsConfirmingBooking(true);
      setQuickReplies(["Confirm Booking", "Make Changes", "Cancel"]);
    } finally {
      setIsLoading(false);
    }
  };

  const processUserMessage = async (userMessage: string) => {
    if (requiresLogin) {
      setQuickReplies(["Log in now"]);
      if (!hasPromptedLoginRef.current) {
        hasPromptedLoginRef.current = true;
        addMessage(
          "Please log in to continue. Tap the button below to sign in.",
          "bot"
        );
      }
      setIsLoading(false);
      return;
    }

    if (isConfirmingBooking) {
      const normalized = userMessage.trim().toLowerCase();
      if (normalized.includes("confirm")) {
        setIsConfirmingBooking(false);
        setQuickReplies([]);
        await finalizeBooking();
        return;
      }
      if (normalized.includes("change") || normalized.includes("edit")) {
        setIsConfirmingBooking(false);
        setQuickReplies([]);
        setBookingData((prev) => ({
          ...prev,
          location: "",
          serviceType: "",
          date: "",
          timeSlot: "",
        }));
        setShowDatePicker(false);
        setBookingStep("location");
        addMessage(
          "Sure—let's update the details. What's the new location for this service?",
          "bot"
        );
        return;
      }
      if (normalized.includes("cancel")) {
        addMessage(
          "No problem. I've cancelled the booking draft. Let me know if you need anything else.",
          "bot"
        );
        resetBookingState();
        return;
      }

      addMessage(
        "Please let me know if you'd like to confirm, make changes, or cancel.",
        "bot"
      );
      return;
    }

    if (bookingStep !== "idle") {
      handleBookingStep(userMessage);
      setIsLoading(false);
      return;
    }

    if (shouldListCategories(userMessage)) {
      showCategoryOptions();
      setIsLoading(false);
      return;
    }

    const keyword = findKeyword(userMessage);
    await fetchServices({ searchTerm: keyword });
  };

  const handleSendMessage = async (event: React.FormEvent) => {
    event.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    if (requiresLogin) {
      setInput("");
      setQuickReplies(["Log in now"]);
      if (!hasPromptedLoginRef.current) {
        hasPromptedLoginRef.current = true;
        addMessage(
          "Please log in to continue. Tap the button below to sign in.",
          "bot"
        );
      }
      return;
    }

    const userMessage = trimmed;
    setInput("");
    addMessage(userMessage, "user");
    setIsLoading(true);
    await processUserMessage(userMessage);
  };

  const handleServiceSelect = async (service: ServiceSuggestion) => {
    addMessage(`I'm interested in "${service.name}".`, "user");
    setServiceResults([]);
    setAwaitingServiceSelection(false);
    setAwaitingCategorySelection(false);
    setIsLoading(true);
    const resolvedService =
      (await fetchServiceByName(service.name)) ?? service;
    setIsLoading(false);
    startBookingFlow(resolvedService);
  };

  const handleCategorySelect = async (category: CategoryInfo) => {
    addMessage(`Show me services in "${category.name}".`, "user");
    setIsLoading(true);
    await fetchServices({ categoryId: category.id, categoryName: category.name });
  };

  const handleQuickReplyClick = async (value: string) => {
    addMessage(value, "user");
    const normalized = value.trim().toLowerCase();

    if (normalized.includes("log in")) {
      setQuickReplies([]);
      router.push("/login?redirect=/chat");
      return;
    }

    if (normalized.includes("view") && normalized.includes("booking")) {
      setQuickReplies([]);
      router.push("/bookings");
      return;
    }

    if (normalized.includes("book another")) {
      setQuickReplies([]);
      addMessage("Great! Tell me what you need and I'll find the best service for you.", "bot");
      return;
    }

    if (requiresLogin) {
      setQuickReplies(["Log in now"]);
      if (!hasPromptedLoginRef.current) {
        hasPromptedLoginRef.current = true;
        addMessage(
          "Please log in to continue. Tap the button below to sign in.",
          "bot"
        );
      }
      return;
    }

    if (isConfirmingBooking) {
      setIsConfirmingBooking(false);
      setQuickReplies([]);

      if (normalized.includes("confirm")) {
        await finalizeBooking();
        return;
      }

      if (
        normalized.includes("change") ||
        normalized.includes("edit") ||
        normalized.includes("update")
      ) {
        setBookingData((prev) => ({
          ...prev,
          location: "",
          serviceType: "",
          date: "",
          timeSlot: "",
        }));
        setShowDatePicker(false);
        setBookingStep("location");
        addMessage(
          "Sure—let's update the details. What's the new location for this service?",
          "bot"
        );
        return;
      }

      if (normalized.includes("cancel")) {
        addMessage(
          "No worries. I've cancelled the booking draft. Let me know if you'd like to try again.",
          "bot"
        );
        resetBookingState();
        return;
      }

      setIsConfirmingBooking(true);
      setQuickReplies(["Confirm Booking", "Make Changes", "Cancel"]);
      return;
    }

    setIsLoading(true);
    handleBookingStep(value);
    setIsLoading(false);
  };

  const handleDateSelection = () => {
    if (!datePickerValue) return;
    const formattedDate = new Date(datePickerValue).toLocaleDateString("en-GB");
    addMessage(formattedDate, "user");
    setShowDatePicker(false);
    setIsLoading(true);
    handleBookingStep(datePickerValue);
    setDatePickerValue("");
    setIsLoading(false);
  };

  const todayISO = useMemo(
    () => new Date().toISOString().split("T")[0],
    []
  );

  return (
    <div className="w-full bg-black h-full relative">
      <Header />
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 py-8 pt-24 md:pt-32 relative overflow-hidden">
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
          }}
        />

        <div
          className="absolute inset-0 z-0"
          style={{
            background:
              "radial-gradient(circle at center, transparent 0%, rgba(15, 15, 15, 0.8) 100%)",
          }}
        />

        <div className="w-full max-w-6xl flex flex-col items-center relative z-10">
          {!hasStartedConversation && !requiresLogin && (
            <>
              <div className="text-center mb-8 md:mb-12 px-2">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold mb-3 md:mb-4 bg-linear-to-r from-[#FFFFFF] to-[#828282] bg-clip-text text-transparent">
                  Welcome to <span>Nex AI</span>
                </h1>
                <p className="text-[#DDDDDD] text-lg sm:text-xl md:text-2xl lg:text-3xl px-2">
                  Describe Your Problem to Get Suggestions
                </p>
              </div>

              <div className="w-full mb-8 md:mb-16 px-2">
                <div className="text-center mb-3 md:mb-4">
                  <span className="text-[#969696] text-base sm:text-lg md:text-xl tracking-wider">How it Works</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 mb-8 md:mb-12">
                  {["Describe Your Problem", "Confirm Your Service", "Make the Payment"].map(
                    (title, index) => (
                      <div
                        key={title}
                        className="rounded-2xl md:rounded-3xl px-4 py-3 md:px-6 md:py-4 relative overflow-hidden flex flex-col justify-center items-start text-left"
                        style={{
                          background:
                            "radial-gradient(ellipse 200px 100px at center bottom, rgba(37, 99, 235, 0.25) 0%, rgba(59, 130, 246, 0.15) 30%, transparent 70%), radial-gradient(ellipse at top left, #1F2060 0%, transparent 50%), radial-gradient(ellipse at top right, #191919 0%, transparent 50%), radial-gradient(ellipse at bottom right, #191919 0%, #191919 100%), radial-gradient(ellipse at bottom left, #1A1B1F 0%, #1A1B1F 100%)",
                          backgroundColor: "#0d0d0d",
                        }}
                      >
                        <h3 className="text-white font-medium text-base md:text-lg mb-1 md:mb-0.5">{title}</h3>
                        <p className="text-[#8b9ab8] text-xs md:text-sm leading-relaxed md:leading-tight">
                          {index === 0 &&
                            "Just type your requirements and Nex AI instantly recommends the best service for you."}
                          {index === 1 &&
                            "Pick the service you like and share a few quick details to schedule it."}
                          {index === 2 &&
                            "Complete the booking payment and track as your service is confirmed."}
                        </p>
                      </div>
                    )
                  )}
                </div>
              </div>
            </>
          )}

          <div
            ref={chatContainerRef}
            className="w-full max-w-3xl mb-20 md:mb-8 max-h-[400px] sm:max-h-[500px] md:max-h-[600px] overflow-y-auto px-2 sm:px-4 scrollbar-hide"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}

            {awaitingCategorySelection && categories.length > 0 && (
              <div className="mb-4 md:mb-6 flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategorySelect(category)}
                    className="px-3 py-2 md:px-4 md:py-2 rounded-full border border-[#2C2C2C] bg-[#101010] text-xs md:text-sm text-white hover:border-[#04438C] hover:bg-[#151515] transition-colors touch-manipulation"
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            )}

            {awaitingServiceSelection && serviceResults.length > 0 && (
              <div className="mb-4 md:mb-6">
                <div className="grid grid-cols-1 gap-2 md:gap-3">
                  {serviceResults.map((service) => (
                    <button
                      key={service.id}
                      onClick={() => handleServiceSelect(service)}
                      className="w-full text-left rounded-xl md:rounded-2xl border border-[#2C2C2C] bg-[#101010] hover:border-[#04438C] hover:bg-[#151515] transition-colors p-4 md:p-5 touch-manipulation"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 gap-1 sm:gap-0">
                        <h3 className="text-base md:text-lg font-semibold text-white break-words">{service.name}</h3>
                        <span className="text-xs uppercase tracking-wide text-[#767676] sm:ml-2">
                          {service.category?.name}
                        </span>
                      </div>
                      <p className="text-xs md:text-sm text-[#cfcfcf]">
                        From{" "}
                        <span className="font-semibold text-white">
                          {service.normal_price || "AED --"}
                        </span>
                      </p>
                      <p className="text-xs text-[#8aa8ff] mt-2 md:mt-3">
                        Tap to continue with this service
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {showDatePicker && (
              <div className="mb-4 md:mb-6">
                <div className="bg-[#101010] border border-[#2C2C2C] rounded-xl md:rounded-2xl p-4 md:p-5 flex flex-col gap-3">
                  <label className="text-xs md:text-sm font-medium text-white">
                    Select a date
                  </label>
                  <input
                    type="date"
                    min={todayISO}
                    value={datePickerValue}
                    onChange={(event) => setDatePickerValue(event.target.value)}
                    className="w-full bg-[#0f0f0f] text-white border border-gray-600 rounded-lg px-3 py-2 md:px-4 md:py-3 text-sm md:text-base focus:outline-none focus:border-blue-500 transition-colors touch-manipulation"
                  />
                  <button
                    type="button"
                    onClick={handleDateSelection}
                    disabled={!datePickerValue || isLoading}
                    className="self-end px-3 py-2 md:px-4 md:py-2 rounded-lg bg-linear-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white text-xs md:text-sm font-semibold transition disabled:opacity-60 disabled:cursor-not-allowed touch-manipulation"
                  >
                    Use this date
                  </button>
                </div>
              </div>
            )}

            {quickReplies.length > 0 && (
              <div className="mb-4 md:mb-6 flex flex-wrap gap-2">
                {quickReplies.map((reply) => (
                  <button
                    key={reply}
                    onClick={() => handleQuickReplyClick(reply)}
                    className="px-3 py-2 md:px-4 md:py-2 rounded-full border border-[#2C2C2C] bg-[#101010] text-xs md:text-sm text-white hover:border-[#04438C] hover:bg-[#151515] transition-colors touch-manipulation"
                  >
                    {reply}
                  </button>
                ))}
              </div>
            )}

            {isBotThinking && !isFetchingServices && (
              <div className="flex justify-start mb-3 md:mb-4">
                <div className="bg-[#1a1a1a] border border-[#2C2C2C] rounded-xl md:rounded-2xl px-3 py-2 md:px-4 md:py-3">
                  <div className="text-xs md:text-sm text-[#bfbfbf]">Thinking…</div>
                </div>
              </div>
            )}

            {isFetchingServices && (
              <div className="flex justify-start mb-3 md:mb-4">
                <div className="bg-[#1a1a1a] border border-[#2C2C2C] rounded-xl md:rounded-2xl px-3 py-2 md:px-4 md:py-3">
                  <div className="flex space-x-1.5 md:space-x-2">
                    <div
                      className="w-1.5 h-1.5 md:w-2 md:h-2 bg-[#04438C] rounded-full animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    />
                    <div
                      className="w-1.5 h-1.5 md:w-2 md:h-2 bg-[#04438C] rounded-full animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    />
                    <div
                      className="w-1.5 h-1.5 md:w-2 md:h-2 bg-[#04438C] rounded-full animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        <div className="w-full max-w-3xl fixed bottom-4 md:bottom-8 left-1/2 transform -translate-x-1/2 px-3 sm:px-4 z-20">
          <form onSubmit={handleSendMessage} className="relative">
            <div
              className="rounded-xl md:rounded-2xl p-px"
              style={{
                background: "linear-gradient(to right, #2C2C2C, #04438C)",
              }}
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={inputPlaceholder}
                disabled={isLoading || requiresLogin}
                className="w-full bg-[#1a1a1a] rounded-xl md:rounded-2xl px-4 py-3 md:px-6 md:py-4 pr-12 md:pr-14 text-sm md:text-base text-white placeholder-[#6b7280] focus:outline-none transition-colors disabled:opacity-50"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading || requiresLogin || !input.trim()}
              className="absolute right-1.5 md:right-2 top-1/2 transform -translate-y-1/2 rounded-full p-2 md:p-3 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-80 touch-manipulation"
            >
              <Image
                src="/send.svg"
                alt="Send"
                width={200}
                height={200}
                className="w-4 h-4 md:w-5 md:h-5"
              />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Page;

