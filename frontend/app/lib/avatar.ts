/**
 * Generates a deterministic gradient pair from any string (e.g. wallet address).
 * Returns a CSS `linear-gradient` string.
 */
export function getAvatarGradient(input: string): string {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = input.charCodeAt(i) + ((hash << 5) - hash);
    hash |= 0;
  }
  const h1 = Math.abs(hash) % 360;
  const h2 = (h1 + 45) % 360;
  return `linear-gradient(135deg, hsl(${h1},60%,55%) 0%, hsl(${h2},70%,42%) 100%)`;
}

/**
 * Returns the initials to display inside an avatar (first two characters of address).
 */
export function getAvatarInitials(address: string): string {
  return address.slice(1, 3).toUpperCase();
}
