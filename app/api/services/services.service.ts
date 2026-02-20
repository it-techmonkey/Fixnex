import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

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

