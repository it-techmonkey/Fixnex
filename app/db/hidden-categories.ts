// TEMP: service categories hidden from the live site per client request (Sept 2026).
// Nothing is deleted — the data still lives in app/db/service.json and in the database.
// To bring a category back: remove it from this array (or set the array to []).
export const HIDDEN_CATEGORIES: string[] = [
  "VIP Yacht Maintenance & Management",
  "Luxury Watch Care",
];

export const isHiddenCategory = (name: string | null | undefined): boolean =>
  !!name && HIDDEN_CATEGORIES.includes(name);
