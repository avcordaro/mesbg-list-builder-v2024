export const useJsonValidation = () => {
  // Function to check if all required keys exist in the JSON object
  function validateKeys(obj: unknown, requiredKeys: string[]) {
    const missingKeys = requiredKeys.filter(
      (key) => !hasKey(obj, key.split(".")),
    );
    if (missingKeys.length > 0) {
      console.warn("Import is missing keys: ", missingKeys);
    }
    return missingKeys.length === 0;
  }

  // Recursive function to check nested keys and handle arrays
  function hasKey(obj, keys) {
    if (!obj) return false;

    const key = keys[0];

    // Check for array notation (key should look like "contacts[]")
    const isArrayCheck = key.endsWith("[]");
    const actualKey = isArrayCheck ? key.slice(0, -2) : key;

    if (isArrayCheck) {
      // If it's an array check, verify the key exists and is an array
      if (!Array.isArray(obj[actualKey])) {
        return false;
      }

      // Recursively check each element in the array
      return obj[actualKey].every((item) => hasKey(item, keys.slice(1)));
    }

    if (keys.length === 1) {
      // Final key in the path, check if it exists
      return Object.prototype.hasOwnProperty.call(obj, actualKey);
    }

    // Recursively check the next key in the path
    return hasKey(obj[actualKey], keys.slice(1));
  }

  return {
    validateKeys,
  };
};
