// demoData.ts
// Turns the demo data files (categories.ts, product.ts and users.ts)
// into records shaped like the models, ready for seed.ts to save.
// Nothing here talks to MongoDB.

import { Types } from "mongoose";
import { PHOTO_FOLDER, photoUrl } from "../config/cloudinary";
import { categories } from "./categories";
import { products, SeedProduct } from "./product";
import { users } from "./users";
import { slugify } from "../utils/slugify";

// next: Step 12: Put the demo data in the database
// (part 1: shape the records)

// -------- Star rating breakdown ---------------------------------------
// The product page shows bars for 5, 4, 3, 2, and 1 stars.
// When product.ts doesn't give ratingCounts, we make believable ones
// for the average rating.

const RATING_SHARE = [
  { minRating: 4.7, shares: [80, 14, 4, 1, 1] },
  { minRating: 4.4, shares: [65, 22, 8, 3, 2] },
  { minRating: 4.7, shares: [50, 20, 12, 6, 4] },
  { minRating: 4.7, shares: [35, 30, 30, 10, 7] },
];

// makeRatingCounts(4.8, 248) -> [199, 35, 10, 2, 2]

export const makeRatingCount = (
  rating: number,
  reviewCount: number,
): number[] => {
  const { shares } = RATING_SHARE.find((row) => {
    return rating >= row.minRating;
  })!;

  const counts = shares.map((share) => {
    return Math.round((reviewCount * share) / 100);
  });

  // Rounding can leave us 1 or 2 off.

  const total = counts.reduce((sum, count) => {
    return sum + count;
  }, 0);

  counts[0] += reviewCount - total;

  return counts;
};

// --- Photos ------------------------------------------------------------
// From all photo IDs on Cloudinary, pick this product's photos.

export const photosFor = (slug: string, photoIds: string[]): string[] => {
  const prefix = `${PHOTO_FOLDER}/${slug}-`;

  return photoIds
    .filter((id) => {
      return id.startsWith(prefix) && /^\d+$/.test(id.slice(prefix.length));
    })
    .sort((a, b) => {
      return Number(a.slice(prefix.length)) - Number(b.slice(prefix.length));
    })
    .map(photoUrl);
};

// --- Categories --------------------------------------------------------
// categories.ts is already shaped like the Category model.

export const demoCategories = () => {
  return categories;
};

// --- Users -------------------------------------------------------------
// users.ts is already shaped like the User model.
// Passwords are hashed by the model when seed.ts saves them.

export const demoUsers = () => {
  return users;
};

// --- Products ----------------------------------------------------------
// One product from products.ts -> one record shaped like the Product model.
// Bundle and related products are linked later in seed.ts (STEP 13).

const buildProduct = (
  item: SeedProduct,
  categoryId: Types.ObjectId,
  photoIds: string[],
) => {
  const slug = slugify(item.name);

  return {
    name: item.name,
    slug,
    description: item.description,
    tagline: item.tagline,
    priceNote: item.priceNote,
    features: item.features ?? [],
    specs: item.specs ?? [],
    category: categoryId,
    brand: item.brand,
    sku: item.sku,
    price: item.price,
    oldPrice: item.oldPrice,
    costPrice: Math.round(item.price * 0.6),
    trackStock: true,
    stock: item.stock,
    lowStockThreshold: 10,
    images: photosFor(item.photo ?? slug, photoIds),
    gallery: [],
    colors: item.colors ?? [],
    tags: item.tags ?? [],
    badge: item.badge,
    highlights: item.highlights ?? [],
    ratings: item.rating,
    reviewCount: item.reviewCount,
    ratingCounts:
      item.ratingCounts ?? makeRatingCount(item.rating, item.reviewCount),
    sold: item.sold ?? item.reviewCount * 4,
    flashSaleStock: item.flashSaleStock,
    status: "published" as const,
  };
};

// All 40 products. categoryIds maps a category slug to its saved _id.

export const demoProducts = (
  categoryIds: Map<string, Types.ObjectId>,
  photoId: string[],
) => {
  return products.map((item) => {
    const categoryId = categoryIds.get(item.category);

    // A typo in products.ts should stop the seed rather than save a bad category.
    if (!categoryId) {
      throw new Error(
        `"${item.name}" has an unknown category: "${item.category}"`,
      );
    }

    return buildProduct(item, categoryId, photoId);
  });
};
