/**
 * Catalog routing utilities for normalizing category and breed slugs
 * to ensure consistent route mapping between backend and static catalogs
 */

/**
 * Normalize a category or breed name to a URL-safe slug
 */
export function normalizeSlug(name: string): string {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

/**
 * Map common backend category names to frontend route slugs
 */
export function mapCategoryNameToSlug(name: string): string {
  const normalized = normalizeSlug(name);
  const mapping: Record<string, string> = {
    'cats': 'cat',
    'cat': 'cat',
    'dogs': 'dog',
    'dog': 'dog',
    'birds': 'bird',
    'bird': 'bird',
    'other-pets': 'other',
    'other': 'other',
  };
  return mapping[normalized] || normalized;
}

/**
 * Map frontend route slug to display name
 */
export function mapSlugToDisplayName(slug: string): string {
  const mapping: Record<string, string> = {
    'cat': 'Cats',
    'dog': 'Dogs',
    'bird': 'Birds',
    'other': 'Other Pets',
  };
  return mapping[slug] || slug.charAt(0).toUpperCase() + slug.slice(1);
}

/**
 * Check if a slug matches a category name (case-insensitive, handles plurals)
 */
export function slugMatchesCategory(slug: string, categoryName: string): boolean {
  const normalizedSlug = normalizeSlug(slug);
  const normalizedCategory = normalizeSlug(categoryName);
  const mappedSlug = mapCategoryNameToSlug(categoryName);
  
  return normalizedSlug === normalizedCategory || 
         normalizedSlug === mappedSlug ||
         normalizedSlug === mapCategoryNameToSlug(normalizedCategory);
}

/**
 * Check if a slug matches a breed name
 */
export function slugMatchesBreed(slug: string, breedName: string): boolean {
  return normalizeSlug(breedName) === normalizeSlug(slug);
}
