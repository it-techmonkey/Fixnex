import { NextRequest, NextResponse } from "next/server";
import {
  processMessage,
  handleFormSubmission,
  shouldShowFallbackForm,
} from "@/lib/conversationState";
import { ChatRequest, ChatResponse, BookingFormData } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (body.type === "form") {
      const formData: BookingFormData = body.data;
      const sessionId = body.sessionId || generateSessionId();

      const response = handleFormSubmission(
        formData.service,
        formData.date,
        formData.time,
        formData.subscriber,
        sessionId,
      );

      return NextResponse.json(response);
    }

    const chatRequest: ChatRequest = body;

    if (!chatRequest.message || !chatRequest.sessionId) {
      return NextResponse.json(
        { error: "Missing message or sessionId" },
        { status: 400 },
      );
    }

    let response: ChatResponse = processMessage(
      chatRequest.message,
      chatRequest.sessionId,
    );

    if (shouldShowFallbackForm(chatRequest.sessionId) && !response.service) {
      response = {
        reply: "Let me take some details to help you better:",
        expecting: null,
        showForm: true,
      };
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error processing chat request:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

