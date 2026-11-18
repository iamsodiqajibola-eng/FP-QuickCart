// api.ts client/src/types/api.ts
// The shapes of what the server sends back, so TypeScript knows what data exists.

// STEP 30 (part 1): Types for the server's replies

// GET /api/categories -> { categories: Category[] }
export type Category = {
  _id: string;
  name: string;
  slug: string;
  icon: string;
  productCount: number;
};

export type CategoriesResponse = { categories: Category[] };

// STEP 31: Users (server: models/User.ts)

export type Address = {
  _id: string;
  label: string;
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  country: string;
  instructions?: string;
  isDefault: boolean;
};

export type User = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: "customer" | "admin";
  isEmailVerified: boolean;
  addresses: Address[];
  savedItems: string[];
  createdAt: string;
  passwordChangedAt?: string; // "password last updated ..." (STEP 30)
};

// POST /api/auth/login and /register -> { token, user }
export type AuthResponse = {
  token: string;
  user: User;
};

// STEP 32: Products (server: models/Product.ts)

export type ProductColor = {
  name: string;
  hex: string;
};

export type ProductSummary = {
  _id: string;
  name: string;
  slug: string;
  brand: string;
  price: number;
  oldPrice?: number;
  images: string[];
  ratings: number;
  reviewCount: number;
  badge?: string;
  tagline?: string;
  priceNote?: string;
  tags: string[];
  sold: number;
  stock: number;
  trackStock: boolean;
  flashSaleStock?: number;
  colors: ProductColor[];
  category: {
    _id: string;
    name: string;
    slug: string;
  };
};

export type ProductsResponse = {
  products: ProductSummary[];
  total: number;
  page: number;
  pages: number;
};

// STEP 35: One product, and its reviews

export type ProductSpec = {
  group: string;
  label: string;
  value: string;
};

export type ProductHighlight = {
  icon: string;
  title: string;
  text: string;
};

// GET /api/products/:idOrSlug
export type Product = ProductSummary & {
  description: string;
  features: string[];
  specs: ProductSpec[];
  highlights: ProductHighlight[];
  sku: string;
  gallery: string[];
  lowStockThreshold: number;
  ratingCounts: number[];
  category: {
    _id: string;
    name: string;
    slug: string;
    icon: string;
  };
  bundleProducts: ProductSummary[];
  relatedProducts: ProductSummary[];
};

export type ProductResponse = {
  product: Product;
};

export type Review = {
  _id: string;
  name: string;
  rating: number;
  title?: string;
  comment: string;
  createdAt: string;
};

// GET /api/reviews/product/:idOrSlug
export type ReviewsResponse = {
  summary: {
    ratings: number;
    reviewCount: number;
    ratingCounts: number[];
  };
  reviews: Review[];
  total: number;
  page: number;
  pages: number;
};

// GET /api/reviews/can-review/:productId
export type CanReviewResponse = {
  canReview: boolean;
  reason: string | null;
  review: Review | null;
};

// STEP 36: Orders (server: models/Order.ts)

// The four possible order statuses
export type OrderStatus = "processing" | "shipped" | "delivered" | "cancelled";

// One line inside an order
export type OrderItem = {
  product: string;
  name: string;
  image: string;
  sku: string;
  price: number;
  quantity: number;
  color?: string;
  lineTotal: number;
};

// One step in the order tracking timeline
export type OrderStatusUpdate = {
  status: OrderStatus;
  note: string;
  at: string;
};

// Payment information
export type OrderPayment = {
  method: "card" | "pay_on_delivery";
  status: "paid" | "pending" | "refunded";
  cardBrand?: string;
  cardLast4?: string;
  reference?: string;
  paidAt?: string;
};

// Complete order
export type Order = {
  _id: string;
  orderNumber: string;
  user: string;
  items: OrderItem[];

  contact: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };

  shippingAddress: Address;

  deliveryMethod: "standard" | "express";
  payment: OrderPayment;

  subtotal: number;
  deliveryFee: number;
  discount: number;
  promoCode?: string;
  total: number;

  status: OrderStatus;
  statusHistory: OrderStatusUpdate[];

  estimatedDelivery: {
    from: string;
    to: string;
  };

  courier?: string;
  waybill?: string;
  deliveredAt?: string;
  cancelledAt?: string;
  cancelReason?: string;

  createdAt: string;
  updatedAt?: string;
};

// Order API response
export type OrderResponse = {
  order: Order;
  canCancel: boolean;
  cancelDeadline: string | null;
};

// STEP 39: My Account (server: getOrderSummary in orderController.ts)

// GET /api/orders/summary -> the numbers and the 3 newest orders for the My Account overview
export type OrderSummaryResponse = {
  totalOrders: number;
  inProgress: number;
  delivered: number;
  recentOrders: Order[];
};

// STEP 40: Order History (server: getMyOrders in orderController.ts)

// GET /api/orders -> my orders + the numbers on the tabs
export type MyOrdersResponse = {
  orders: Order[];
  counts: {
    all: number;
    "in-progress": number;
    shipped: number;
    delivered: number;
    cancelled: number;
  };
};

// STEP 42: Admin products and categories (server: adminProductController.ts, adminCategoryController.ts, STEP 25)

export type ProductStatus = "published" | "draft" | "scheduled";

// One row of GET /api/admin/products (the server's TABLE_FIELDS)
export type AdminProductRow = {
  _id: string;
  name: string;
  slug: string;
  sku: string;
  brand: string;
  category: { _id: string; name: string; slug: string } | null;
  price: number;
  oldPrice?: number;
  costPrice?: number;
  images: string[];
  trackStock: boolean;
  stock: number;
  lowStockThreshold: number;
  status: ProductStatus;
  publishAt?: string;
  badge?: string;
  updatedAt: string;
};

export type AdminProductTab =
  | "all"
  | "in-stock"
  | "low-stock"
  | "out-of-stock"
  | "drafts";

export type AdminProductsResponse = {
  products: AdminProductRow[];
  total: number;
  page: number;
  pages: number;
  counts: Record<AdminProductTab, number>;
};

// GET /api/admin/products/:id -> the whole product, for the edit form (category is just its id here)
export type AdminProductDetail = Omit<AdminProductRow, "category"> & {
  category: string;
  description: string;
  tagline?: string;
  features: string[];
  tags: string[];
};

// GET /api/admin/categories -> every category, counting drafts too
export type AdminCategory = {
  _id: string;
  name: string;
  slug: string;
  icon: string;
  productCount: number;
};
