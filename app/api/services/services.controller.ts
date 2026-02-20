import { NextRequest, NextResponse } from "next/server";
import { ServicesService } from "./services.service";

export class ServicesController {
  constructor(private readonly service = new ServicesService()) {}

  async list(request: NextRequest) {
    try {
      const url = new URL(request.url);
      const search = url.searchParams.get("search") ?? undefined;
      const category = url.searchParams.get("category") ?? undefined;
      const categoryId = url.searchParams.get("categoryId") ?? undefined;

      const services = await this.service.getAllServices({
        search,
        category,
        categoryId,
      });
      return NextResponse.json(
        {
          message: "Services fetched successfully.",
          services,
        },
        { status: 200 }
      );
    } catch (error) {
      console.error("List services error:", error);
      return NextResponse.json(
        { message: "Unable to fetch services right now. Please try again later." },
        { status: 500 }
      );
    }
  }

  async detail(request: NextRequest, id: string) {
    try {
      if (!id) {
        return NextResponse.json({ message: "Service ID is required." }, { status: 400 });
      }

      const service = await this.service.getServiceById(id);
      if (!service) {
        return NextResponse.json({ message: "Service not found." }, { status: 404 });
      }

      return NextResponse.json(
        {
          message: "Service fetched successfully.",
          service,
        },
        { status: 200 }
      );
    } catch (error) {
      console.error("Get service error:", error);
      return NextResponse.json(
        { message: "Unable to fetch the service right now. Please try again later." },
        { status: 500 }
      );
    }
  }
}

