export function slugify(inputString: string): string {
  if (!inputString) return "";

  // Replace spaces with hyphens
  let slug = inputString.replace(/\s+/g, "-");

  // Remove any non-alphanumeric characters except hyphens
  slug = slug.replace(/[^a-zA-Z0-9-]/g, "");

  // Replace any consecutive hyphens with a single hyphen
  slug = slug.replace(/--+/g, "-");

  // Convert to lowercase
  slug = slug.toLowerCase();

  return slug;
}

export function generateRandomHash(length: number) {
  const characters = "abcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  const charactersLength = characters.length;

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charactersLength);
    result += characters[randomIndex];
  }

  return result;
}

export function isMovieQuote(str: string): boolean {
  // Regular expression to check if the string starts and ends with a double quote
  const regex = /^".*?"$/;

  return regex.test(str);
}

export function withSuffix(id: string, existingIds: string[] = []) {
  const hashedId = id + "-" + generateRandomHash(6);
  if (existingIds.includes(hashedId)) {
    return withSuffix(id, existingIds);
  }
  return hashedId;
}

// Function to find the best matching key
export function findBestMatch(str: string, obj: Record<string, unknown>) {
  if (str === "") return "";

  // Get all keys from the object
  const keys = Object.keys(obj);

  // Find the key that the string includes, excluding empty keys
  for (const key of keys) {
    if (key && str.includes(key)) {
      return key;
    }
  }
  return null;
}
