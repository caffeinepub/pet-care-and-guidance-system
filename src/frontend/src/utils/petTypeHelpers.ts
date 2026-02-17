import type { PetType } from '../backend';

/**
 * Convert PetType discriminated union to a string for UI display
 */
export function petTypeToString(petType: PetType): string {
  if (petType.__kind__ === 'dog') return 'dog';
  if (petType.__kind__ === 'cat') return 'cat';
  if (petType.__kind__ === 'bird') return 'bird';
  if (petType.__kind__ === 'other') return petType.other;
  return 'unknown';
}

/**
 * Convert a string to PetType discriminated union
 */
export function stringToPetType(str: string): PetType {
  if (str === 'dog') return { __kind__: 'dog', dog: null };
  if (str === 'cat') return { __kind__: 'cat', cat: null };
  if (str === 'bird') return { __kind__: 'bird', bird: null };
  return { __kind__: 'other', other: str };
}

/**
 * Get display name for a PetType
 */
export function getPetTypeDisplayName(petType: PetType): string {
  if (petType.__kind__ === 'dog') return 'Dog';
  if (petType.__kind__ === 'cat') return 'Cat';
  if (petType.__kind__ === 'bird') return 'Bird';
  if (petType.__kind__ === 'other') return petType.other;
  return 'Unknown';
}

/**
 * Check if two PetTypes are equal
 */
export function petTypesEqual(a: PetType, b: PetType): boolean {
  if (a.__kind__ !== b.__kind__) return false;
  if (a.__kind__ === 'other' && b.__kind__ === 'other') {
    return a.other === b.other;
  }
  return true;
}
