/**
 * Recursively performs a deep equality comparison between two values.
 *
 * Specifically ignores the structural metadata properties 'id' and 'blockType'
 * to avoid triggering false-dirty states on block data structure modifications.
 *
 * @param a - First value to compare
 * @param b - Second value to compare
 * @returns boolean indicating if the values are deeply equal
 */
export function isDeepEqual(a: unknown, b: unknown): boolean {
  // If they are strictly equal by reference or value
  if (a === b) {
    return true;
  }

  // Handle Date objects
  if (a instanceof Date || b instanceof Date) {
    if (a instanceof Date && b instanceof Date) {
      return a.getTime() === b.getTime();
    }
    return false;
  }

  // If either value is a primitive or null, and they weren't strictly equal, they are not equal.
  if (typeof a !== 'object' || a === null || typeof b !== 'object' || b === null) {
    return false;
  }

  // Handle Arrays
  const isArrayA = Array.isArray(a);
  const isArrayB = Array.isArray(b);

  if (isArrayA !== isArrayB) {
    return false;
  }

  if (isArrayA && isArrayB) {
    const arrA = a as unknown[];
    const arrB = b as unknown[];
    if (arrA.length !== arrB.length) {
      return false;
    }
    for (let i = 0; i < arrA.length; i++) {
      if (!isDeepEqual(arrA[i], arrB[i])) {
        return false;
      }
    }
    return true;
  }

  // Handle standard objects
  // Filter out structural metadata properties: 'id' and 'blockType'
  const objA = a as Record<string, unknown>;
  const objB = b as Record<string, unknown>;
  const keysA = Object.keys(objA).filter(key => key !== 'id' && key !== 'blockType');
  const keysB = Object.keys(objB).filter(key => key !== 'id' && key !== 'blockType');

  if (keysA.length !== keysB.length) {
    return false;
  }

  // Check that all keys in a are in b and their values are deeply equal
  for (const key of keysA) {
    if (!Object.prototype.hasOwnProperty.call(objB, key)) {
      return false;
    }
    if (!isDeepEqual(objA[key], objB[key])) {
      return false;
    }
  }

  return true;
}

