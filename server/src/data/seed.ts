// seed.ts
// Fills the database with demo data: npm run seed
// Running it again wipes the demo collections and starts fresh.

import mongoose, { Types } from "mongoose";
import { Category } from "../models/category";
import { Product } from "../models/product";
import { User } from "../models/user";
import { demoCategories, demoProducts, demoUsers } from "./demoData";
import { listProductionPhotoIds } from "../config/cloudinary";
import { products } from "./product";
import { categories } from "./categories";
import { connectDB } from "../config/database";

// Step 13: The seed command

// seedDatabase() does the work and is exported,
// so the demo panel can reuse it.

export const seedDatabase = async () => {
  // 1. Empty the collections.

  await Promise.all([
    Category.deleteMany({}),
    Product.deleteMany({}),
    User.deleteMany({}),
  ]);

  // 2. Save categories and remember each ID by slug.

  console.log("ACTUAL CATEGORY DATA:", JSON.stringify(categories, null, 2));
  console.log("TOTAL CATEGORIES:", categories.length);

  const savedCategories = await Category.insertMany(demoCategories());

  const categoryIds = new Map<string, Types.ObjectId>(
    savedCategories.map((category) => {
      return [category.slug, category._id];
    }),
  );

  // 3. Get the available Cloudinary photos.

  const photoIds = await listProductionPhotoIds();

  console.log("TOTAL CLOUDINARY PHOTOS:", photoIds.length);
  console.log(
    "SNEAKER PHOTOS:",
    photoIds.filter((id) => id.includes("canvas-low-top-sneakers")),
  );
  console.log(
    "DESK LAMP PHOTOS:",
    photoIds.filter((id) => id.includes("minimalist-led-desk-lamp")),
  );
  console.log(
    "CAST IRON MATCH:",
    photoIds.filter((id) => id.includes("cast-iron-skillet-10-inch")),
  );

  // 4. Save products.

  const savedProducts = await Product.insertMany(
    demoProducts(categoryIds, photoIds),
  );

  // 5. Link bundles and related products.

  const productIds = new Map<string, Types.ObjectId>(
    savedProducts.map((product) => {
      return [product.name, product._id];
    }),
  );

  // Convert product names into MongoDB ObjectIds.

  const idsFor = (names: string[] | undefined, owner: string) => {
    return (names ?? []).map((name) => {
      const id = productIds.get(name);

      if (!id) {
        throw new Error(
          `"${owner}" links to a product that doesn't exist: "${name}"`,
        );
      }

      return id;
    });
  };

  // Update bundles and related products in one bulk operation.

  await Product.bulkWrite(
    products.map((item) => {
      return {
        updateOne: {
          filter: { _id: productIds.get(item.name) },
          update: {
            $set: {
              bundleProducts: idsFor(item.bundle, item.name),
              relatedProducts: idsFor(item.related, item.name),
            },
          },
        },
      };
    }),
  );

  // 6. Save the demo users.
  // User.create (NOT insertMany): only create/save runs the model's
  // pre("save") hook, which hashes the passwords.

  const savedUsers = await User.create(demoUsers());

  // 7. A summary of everything saved.

  return {
    categories: savedCategories.length,
    products: savedProducts.length,
    users: savedUsers.length,
    withoutPhotos: savedProducts
      .filter((product) => product.images.length === 0)
      .map((product) => product.name),
  };
};

// Runs when you type npm run seed.

const runSeed = async () => {
  try {
    await connectDB();

    const result = await seedDatabase();

    console.log(
      `Seeded ${result.categories} categories, ${result.products} products and ${result.users} users`,
    );

    if (result.withoutPhotos.length > 0) {
      console.log(
        "These products have no photos:",
        result.withoutPhotos.join(", "),
      );
    }
  } catch (error) {
    console.error(
      "Seed failed:",
      error instanceof Error ? error.message : error,
    );

    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

// Run only when this file is executed directly.

if (require.main === module) {
  runSeed();
}
