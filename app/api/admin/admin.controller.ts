import { NextRequest, NextResponse } from "next/server";
import { AdminService } from "./admin.services";

export class AdminController {
  constructor(private readonly service = new AdminService()) {}

  async dashboard(_request: NextRequest) {
    try {
      const payload = await this.service.getDashboardMetrics();
      return NextResponse.json(payload, { status: 200 });
    } catch (error) {
      console.error("Admin dashboard error:", error);
      
      // Provide more detailed error information
      const errorMessage = error instanceof Error 
        ? error.message 
        : "Unknown error occurred";
      
      // Log full error details for debugging
      console.error("Full error details:", {
        message: errorMessage,
        stack: error instanceof Error ? error.stack : undefined,
        error: error,
      });
      
      return NextResponse.json(
        {
          message: errorMessage.includes("Prisma") || errorMessage.includes("database")
            ? "Database connection error. Please check your database configuration."
            : "Unable to load admin dashboard metrics right now. Please try again later.",
          error: process.env.NODE_ENV === "development" ? errorMessage : undefined,
        },
        { status: 500 }
      );
    }
  }

  async trendingServices(request: NextRequest) {
    try {
      const { searchParams } = new URL(request.url);
      const period = (searchParams.get('period') as 'day' | 'week' | 'month' | 'year') || 'month';

      if (!['day', 'week', 'month', 'year'].includes(period)) {
        return NextResponse.json(
          {
            message: "Invalid period. Must be one of: day, week, month, year",
          },
          { status: 400 }
        );
      }

      const payload = await this.service.getTrendingServices(period);
      return NextResponse.json(
        {
          message: `Trending services for the last ${period}`,
          ...payload,
        },
        { status: 200 }
      );
    } catch (error) {
      console.error("Trending services error:", error);
      return NextResponse.json(
        {
          message: "Unable to load trending services right now. Please try again later.",
        },
        { status: 500 }
      );
    }
  }
}


