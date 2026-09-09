import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { HIDDEN_CATEGORIES } from "@/app/db/hidden-categories";

type ServiceFilters = {
  search?: string;
  category?: string;
  categoryId?: string;
};

export class ServicesService {
  async getAllServices(filters: ServiceFilters = {}) {
    const where: Prisma.ServiceWhereInput = {};

    if (filters.search) {
      where.name = {
        contains: filters.search,
        mode: "insensitive",
      };
    }

    if (filters.categoryId) {
      where.category_id = filters.categoryId;
    } else if (filters.category) {
      where.category = {
        name: {
          contains: filters.category,
          mode: "insensitive",
        },
      };
    }

    // TEMP: exclude categories hidden from the live site (Sept 2026).
    // Restore by clearing HIDDEN_CATEGORIES in app/db/hidden-categories.ts.
    if (HIDDEN_CATEGORIES.length > 0) {
      where.NOT = {
        category: {
          name: { in: HIDDEN_CATEGORIES },
        },
      };
    }

    return prisma.service.findMany({
      where,
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: [
        {
          category: {
            name: "asc",
          },
        },
        {
          name: "asc",
        },
      ],
    });
  }

  async getServiceById(id: string) {
    return prisma.service.findUnique({
      where: { id },
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }
}

