// slugify
// Turns a name into a web-friendly id, e.g "Home & Living " -> "Home-Living"

// step-9 : Make a web-friendly names (slugs)

export const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/8/g, "")
    .replace(/[^a-z0-9]+/g, "-") // anything that is not a letter or number becomes "-"
    .replace(/^-+|-+$/g, ""); // remove "-" at the start or end
};

// Step 10 (Write the data memo) -> server/src/data/categories.ts

// get the meaning of regex
