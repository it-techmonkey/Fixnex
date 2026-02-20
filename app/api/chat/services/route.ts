import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { Service } from "@/lib/types";

export async function GET() {
  try {
    const servicesPath = path.join(process.cwd(), "data", "services.json");
    const data = fs.readFileSync(servicesPath, "utf-8");
    const services = JSON.parse(data) as Service[];

    return NextResponse.json(services);
  } catch (error) {
    console.error("Error loading chat services:", error);
    return NextResponse.json(
      { error: "Unable to load services at the moment." },
      { status: 500 },
    );
  }
}

