export function validateLocation(location: string | null): boolean {
  return Boolean(location && location.trim().length > 0);
}

export function formatLocation(location: string): string {
  return location.trim();
}

export function parseCoordinates(location: string): { lat: number; lng: number } | null {
  try {
    const [lat, lng] = location.split(',').map(Number);
    if (isNaN(lat) || isNaN(lng)) return null;
    return { lat, lng };
  } catch {
    return null;
  }
}