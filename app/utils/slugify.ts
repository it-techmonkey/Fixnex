/**
 * Convert a service name to a URL-friendly slug
 * Example: "AC servicing & repair" -> "ac-servicing-repair"
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Find a service by its slug across all categories
 */
export function findServiceBySlug(slug: string, serviceData: any[]) {
  for (const category of serviceData) {
    const service = category.services.find(
      (s: any) => slugify(s.name) === slug
    );
    if (service) {
      return {
        service,
        category: category.category
      };
    }
  }
  return null;
}

/**
 * Generate all possible service slugs for static generation
 */
export function getAllServiceSlugs(serviceData: any[]): string[] {
  const slugs: string[] = [];
  
  serviceData.forEach(category => {
    category.services.forEach((service: any) => {
      slugs.push(slugify(service.name));
    });
  });
  
  return slugs;
}

