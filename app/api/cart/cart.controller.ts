import { NextRequest, NextResponse } from "next/server";
import { CartService } from "./cart.service";

type UpdateCartBody = {
  serviceIds?: string[];
};

export class CartController {
  constructor(private readonly service = new CartService()) {}

  async detail(_request: NextRequest, userId: string) {
    try {
      if (!userId) {
        return NextResponse.json({ message: "User ID is required." }, { status: 400 });
      }

      const cart = await this.service.getCartByUserId(userId);
      if (!cart) {
        return NextResponse.json(
          { message: "Cart not found for the user.", cart: { userId, services: [] } },
          { status: 200 }
        );
      }

      return NextResponse.json(
        { message: "Cart fetched successfully.", cart },
        { status: 200 }
      );
    } catch (error) {
      console.error("Get cart error:", error);
      return NextResponse.json(
        { message: "Unable to fetch cart right now. Please try again later." },
        { status: 500 }
      );
    }
  }

  async update(request: NextRequest, userId: string) {
    try {
      if (!userId) {
        return NextResponse.json({ message: "User ID is required." }, { status: 400 });
      }

      const body = (await request.json()) as UpdateCartBody;
      const serviceIds = this.normalizeServiceIds(body?.serviceIds);

      if (serviceIds.length === 0) {
        const cleared = await this.service.clearCart(userId);
        return NextResponse.json(
          {
            message: "Cart cleared successfully.",
            cart: cleared,
          },
          { status: 200 }
        );
      }

      const cart = await this.service.updateCart(userId, serviceIds);

      return NextResponse.json(
        { message: "Cart updated successfully.", cart },
        { status: 200 }
      );
    } catch (error) {
      console.error("Update cart error:", error);
      if ((error as { code?: string }).code === "USER_NOT_FOUND") {
        return NextResponse.json({ message: "User not found." }, { status: 404 });
      }
      return NextResponse.json(
        { message: "Unable to update cart right now. Please try again later." },
        { status: 500 }
      );
    }
  }

  private normalizeServiceIds(serviceIds?: string[]) {
    if (!Array.isArray(serviceIds)) {
      return [];
    }

    return serviceIds
      .map((id) => (typeof id === "string" ? id.trim() : ""))
      .filter((id) => id.length > 0);
  }
}

