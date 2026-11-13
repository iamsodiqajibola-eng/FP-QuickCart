// Product Model
// Something the shop sell. Prices and whole naira, e.g 54000 = 45,000

import { model, Schema, Types } from "mongoose";
import { ref, title } from "node:process";

export interface IProductColor {
  name: string; // e.g "Midnight Black"
  hex: String; // e.g #1f2937
}

export interface IproductSpec {
  group: string; // e.g "Audio and Connectivity"
  label: string; // e.g "driver size"
  value: string; // e.g "40mm Neodymium"
}

export interface IProductHighlight {
  icon: string; // "e.g Material icon name, e.g "Hearing"
  title: string; // e.g "Hybrid active noise cancelling"
  text: string; // one or two sentences
}

// Step 8: The Product Model
// Everything about a product : name, slug, price (whole naira), stock, image, colours, specs, rating...

export interface IProduct {
  name: string;
  slug: string;
  description: string;
  tagline?: string; // on short line for small card e.g "Braided 1.8m lossless wire"
  priceNote?: string; // short line under the price on small cards e.g "Free shipping"
  features: string[]; // short bullet points shown on the product page
  specs: IproductSpec[]; // "the full specification" table
  category: Types.ObjectId; // points to a Category
  brand: string;
  sku: string; // stock code, e.g "QC-AU-9042"
  price: Number;
  oldPrice?: number; // crossed-out price when on sale
  costPrice?: number; // what the shop paid (admin only)
  trackStock: boolean; // false = never sells out and stock isit counted down (e.g made to order)
  stock: number;
  lowStockThreshold: number;
  images: string[]; // images[0] is the photo on product cards
  gallery: string[]; // large photos for the product details page (empty = use images)
  colors: IProductColor[];
  tags: string[];
  badge?: string; // e.g. "Sale" "Top Seller" "New"
  highlights: IProductHighlight[]; // The three features cards under the photos on the ptoject page
  ratings: number; // avarage star rating 0 to 5
  reviewCount: number; //
  ratingscounts: number[]; // how many 5, 4, 3, 2, 1 star rating (in that order )
  sold: number; // how many have been sold (used for the "Best sellers")
  flashSaleStock?: number; // units offered in the flash sales, used to show "Claimed: 82%"
  bundleProducts: Types.ObjectId[]; // "Frequently bought together" product
  relatedProducts: Types.ObjectId[]; // "Related products" (empty = same category)
  status: "published" | "draft" | "scheduled";
  publishAt?: Date; // for "Scheduled": the product goes live at this time
}

const productSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    slug: { type: String, required: true, unique: true, lowercase: true },

    description: { type: String, default: "" },

    tagline: { type: String },

    priceNote: { type: String },

    features: [{ type: String }],

    specs: [{ group: String, label: String, value: String }],

    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },

    brand: { type: String, default: "" },

    sku: { type: String, required: true, unique: true },

    price: { type: Number, required: true, min: 0 },

    oldPrice: { type: Number, min: 0 },

    costPrice: { type: Number, min: 0 },

    trackStock: { type: Boolean, default: true },

    stock: { type: Number, required: true, min: 0, default: 0 },

    lowStockThreshold: { type: Number, default: 10 },

    images: [{ type: String }],

    gallery: [{ type: String }],

    colors: [{ name: String, hex: String }],

    tags: [{ type: String }],

    badge: { type: String },

    highlights: [{ icon: String, title: String, text: String }],

    ratings: { type: Number, default: 0, min: 0, max: 5 },

    reviewCount: { type: Number, default: 0 },

    ratingscounts: [{ type: Number }],

    sold: { type: Number, default: 0, min: 0 },

    flashSaleStock: { type: Number, min: 0 },

    bundleProducts: [{ type: Schema.Types.ObjectId, ref: "Product" }],

    relatedProducts: [{ type: Schema.Types.ObjectId, ref: "Product" }],

    status: {
      type: String,
      enum: ["published", "draft", "scheduled"],
      default: "published",
    },

    publishAt: { type: Date },
  },
  { timestamps: true },
);

//Step 8 (Part of this step): The Product model
// The Filter every public product query uses.

// Product shoppers can see right now: published or scheduled, with thier time already passed.

//use it in every public query

export const liveProducts = () => {
  return {
    $or: [
      { status: "published" as const },
      { status: "scheduled" as const, publishAt: { $lte: new Date() } },
    ],
  };
};

export const Product = model<IProduct>("Product", productSchema);
