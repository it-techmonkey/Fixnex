import { Service, PatternMatchResult } from "@/lib/types";
import fs from "fs";
import path from "path";

function loadServices(): Service[] {
  try {
    const servicesPath = path.join(process.cwd(), "data", "services.json");
    const data = fs.readFileSync(servicesPath, "utf-8");
    return JSON.parse(data) as Service[];
  } catch (error) {
    console.error("Error loading services:", error);
    return [];
  }
}

let servicesCache: Service[] | null = null;
function getServices(): Service[] {
  if (!servicesCache) {
    servicesCache = loadServices();
  }
  return servicesCache;
}

function normalizeText(text: string): string {
  return text.toLowerCase().trim().replace(/\s+/g, " ");
}

function matchService(message: string): PatternMatchResult | null {
  const normalized = normalizeText(message);
  let bestMatch: Service | null = null;
  let bestScore = 0;
  const services = getServices();

  const stopWords = new Set([
    "the",
    "a",
    "an",
    "and",
    "or",
    "but",
    "in",
    "on",
    "at",
    "to",
    "for",
    "of",
    "with",
    "by",
    "is",
    "are",
    "was",
    "were",
    "be",
    "been",
    "have",
    "has",
    "had",
    "do",
    "does",
    "did",
    "will",
    "would",
    "should",
    "could",
    "may",
    "might",
    "can",
    "must",
    "this",
    "that",
    "these",
    "those",
    "i",
    "you",
    "he",
    "she",
    "it",
    "we",
    "they",
    "me",
    "him",
    "her",
    "us",
    "them",
    "my",
    "your",
    "his",
    "her",
    "its",
    "our",
    "their",
    "what",
    "when",
    "where",
    "who",
    "why",
    "how",
    "today",
    "tomorrow",
    "yesterday",
    "now",
    "then",
    "here",
    "there",
    "yes",
    "no",
    "ok",
    "okay",
    "sure",
    "thanks",
    "thank",
    "please",
    "hi",
    "hello",
    "hey",
    "need",
    "want",
    "looking",
    "book",
    "booking",
    "schedule",
    "appointment",
  ]);

  for (const service of services) {
    for (const keyword of service.keywords) {
      const keywordLower = normalizeText(keyword);

      if (keywordLower.length < 2) continue;
      if (stopWords.has(keywordLower)) continue;

      const escapedKeyword = keywordLower.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const isShortKeyword = keywordLower.length <= 3;

      if (isShortKeyword) {
        const keywordBoundaryRegex = new RegExp(`\\b${escapedKeyword}\\b`, "i");
        if (keywordBoundaryRegex.test(normalized)) {
          const score = Math.min(1.0, keywordLower.length / 20) * 0.9;
          if (score > bestScore) {
            bestScore = score;
            bestMatch = service;
          }
        }
      } else {
        const keywordBoundaryRegex = new RegExp(`\\b${escapedKeyword}\\b`, "i");
        if (keywordBoundaryRegex.test(normalized)) {
          const score = Math.min(1.0, keywordLower.length / 20) * 0.9;
          if (score > bestScore) {
            bestScore = score;
            bestMatch = service;
          }
        } else if (normalized.includes(keywordLower)) {
          const score = Math.min(1.0, keywordLower.length / 20) * 0.7;
          if (score > bestScore) {
            bestScore = score;
            bestMatch = service;
          }
        }
      }

      const keywordWords = keywordLower
        .split(/\s+/)
        .filter((w) => w.length >= 2 && !stopWords.has(w));
      for (const word of keywordWords) {
        const escapedWord = word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const wordBoundaryRegex = new RegExp(`\\b${escapedWord}\\b`, "i");

        if (wordBoundaryRegex.test(normalized)) {
          const wordScore = Math.min(1.0, word.length / 15) * 0.7;
          if (wordScore > bestScore) {
            bestScore = wordScore;
            bestMatch = service;
          }
        }
      }

      for (const word of keywordWords) {
        if (word.length >= 4 && normalized.includes(word)) {
          const wordIndex = normalized.indexOf(word);
          if (wordIndex >= 0) {
            const before = wordIndex > 0 ? normalized[wordIndex - 1] : " ";
            const after =
              wordIndex + word.length < normalized.length
                ? normalized[wordIndex + word.length]
                : " ";
            const isWordBoundary = !/\w/.test(before) && !/\w/.test(after);

            if (isWordBoundary) {
              const wordScore = Math.min(1.0, word.length / 20) * 0.5;
              if (wordScore > bestScore) {
                bestScore = wordScore;
                bestMatch = service;
              }
            }
          }
        }
      }
    }
  }

  if (bestMatch && bestScore > 0.15) {
    return {
      intent: "service",
      service: bestMatch.name,
      confidence: bestScore,
    };
  }

  return null;
}

function extractDate(message: string): string | null {
  const normalized = normalizeText(message);

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (/\btoday\b/i.test(normalized)) {
    return formatDate(today);
  }

  if (
    /\btomorrow\b/i.test(normalized) ||
    /\btommorow\b/i.test(normalized) ||
    /\btommorrow\b/i.test(normalized)
  ) {
    return formatDate(tomorrow);
  }

  const dayNames = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];
  for (let i = 0; i < dayNames.length; i++) {
    if (normalized.includes(dayNames[i])) {
      const dayIndex = i;
      const currentDay = today.getDay();
      let daysUntil = dayIndex - currentDay;
      if (daysUntil <= 0) daysUntil += 7;
      const targetDate = new Date(today);
      targetDate.setDate(today.getDate() + daysUntil);
      return formatDate(targetDate);
    }
  }

  const datePatterns = [
    /(\d{1,2})\/(\d{1,2})\/(\d{4})/,
    /(\d{1,2})\/(\d{1,2})/,
    /(\d{1,2})-(\d{1,2})-(\d{4})/,
    /(\d{1,2})-(\d{1,2})/,
    /(\d{4})-(\d{1,2})-(\d{1,2})/,
  ];

  for (const pattern of datePatterns) {
    const match = normalized.match(pattern);
    if (match) {
      let day: number;
      let month: number;
      let year: number;

      if (match[3] && match[3].length === 4) {
        if (pattern === datePatterns[4]) {
          year = parseInt(match[1], 10);
          month = parseInt(match[2], 10);
          day = parseInt(match[3], 10);
        } else {
          day = parseInt(match[1], 10);
          month = parseInt(match[2], 10);
          year = parseInt(match[3], 10);
        }
      } else {
        day = parseInt(match[1], 10);
        month = parseInt(match[2], 10);
        year = today.getFullYear();

        const testDate = new Date(year, month - 1, day);
        if (testDate < today) {
          year = year + 1;
        }
      }

      const date = new Date(year, month - 1, day);
      if (date.getDate() === day && date.getMonth() === month - 1) {
        return formatDate(date);
      }
    }
  }

  return null;
}

function extractTime(message: string): string | null {
  const normalized = normalizeText(message);

  const timeKeywords: Record<string, string> = {
    morning: "09:00",
    afternoon: "14:00",
    evening: "18:00",
    night: "20:00",
    noon: "12:00",
    midday: "12:00",
  };

  for (const [keyword, time] of Object.entries(timeKeywords)) {
    if (normalized.includes(keyword)) {
      return time;
    }
  }

  const time12Pattern = /(\d{1,2})(?::(\d{2}))?\s*(am|pm)/i;
  const time12Match = normalized.match(time12Pattern);
  if (time12Match) {
    let hours = parseInt(time12Match[1], 10);
    const minutes = time12Match[2] ? parseInt(time12Match[2], 10) : 0;
    const period = time12Match[3].toLowerCase();

    if (period === "pm" && hours !== 12) hours += 12;
    if (period === "am" && hours === 12) hours = 0;

    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`;
  }

  const time24Pattern = /(\d{1,2}):(\d{2})/;
  const time24Match = normalized.match(time24Pattern);
  if (time24Match) {
    const hours = parseInt(time24Match[1], 10);
    const minutes = parseInt(time24Match[2], 10);
    if (hours >= 0 && hours < 24 && minutes >= 0 && minutes < 60) {
      return `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}`;
    }
  }

  return null;
}

function extractSubscriber(message: string): boolean | null {
  const normalized = normalizeText(message);

  const subscriberKeywords = ["subscriber", "member", "membership", "subscribed"];
  const nonSubscriberKeywords = [
    "not a subscriber",
    "not a member",
    "no membership",
    "not subscribed",
  ];

  for (const keyword of nonSubscriberKeywords) {
    if (normalized.includes(keyword)) {
      return false;
    }
  }

  for (const keyword of subscriberKeywords) {
    if (normalized.includes(keyword)) {
      const negativePatterns = ["not", "don't", "do not", "no"];
      const keywordIndex = normalized.indexOf(keyword);
      const beforeKeyword = normalized.substring(
        Math.max(0, keywordIndex - 20),
        keywordIndex,
      );

      for (const neg of negativePatterns) {
        if (beforeKeyword.includes(neg)) {
          return false;
        }
      }

      return true;
    }
  }

  if (normalized.match(/\b(yes|yeah|yep|sure|ok|okay)\b/)) {
    return true;
  }
  if (normalized.match(/\b(no|nope|nah)\b/)) {
    return false;
  }

  return null;
}

function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function matchPattern(
  message: string,
  expectingService: boolean = true,
): PatternMatchResult {
  const serviceMatch = expectingService ? matchService(message) : null;
  const date = extractDate(message);
  const time = extractTime(message);
  const subscriber = extractSubscriber(message);

  if (serviceMatch) {
    return {
      ...serviceMatch,
      date: date || undefined,
      time: time || undefined,
      subscriber: subscriber ?? undefined,
    };
  }

  if (date) {
    return {
      intent: "date",
      date,
      confidence: 0.8,
    };
  }

  if (time) {
    return {
      intent: "time",
      time,
      confidence: 0.8,
    };
  }

  if (subscriber !== null) {
    return {
      intent: "subscriber",
      subscriber,
      confidence: 0.7,
    };
  }

  return {
    intent: "unknown",
    confidence: 0,
  };
}

export function getAllServices(): Service[] {
  return getServices();
}

