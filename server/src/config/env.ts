// env.ts
// reads the settings from the .env file in one place, so the rest of the code uses `env.port`, `env.mongoUri`, etc

import dotenv from "dotenv";

dotenv.config({ quiet: true });

// === Step 1: Read the settings from .env
//All settings (port, database address, JWT Secret....) are read from .env here, once, so the rest of the code uses env.port, env.monogoUri and so on.

//Next: Step 2 (Connect to MongoDB) - server/src/config/database.ts

export const env = {
  port: Number(process.env.Port) || 5000,
  mongoUri:
    process.env.MONGO_URL ||
    "mongodb+srv://iamsodiqajibola_db_user:nrH7iAE9bdPedKGT@cluster0.zhgzuo5.mongodb.net/",

  jwtSecret: process.env.JWT_SECRET || "dev-secret-dontchange-me",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "15d", // "Remain logged in for 15days"
  clientUrl: process.env.CLIENT_URL || "http://localhost:5173",

  //The hidden demo panel (reset the data, move orders along for presentations.)
  // on while developing (npm run dev ..... runs the .ts files); off the built site (npm start .js from dist)

  // unless DEMO_MODE=true is set. DEMO_MODE=false always turn it off

  demoMode: process.env.DEMO_MODE
    ? process.env.DEMO_MODE === "true"
    : __filename.endsWith("ts"),

  //cloudinary  stores the product photos (see config/cloudinary.ts). Empty = use the photo in client/public

  cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME || "",
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY || "",
  cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET || "",
};

// Note i change the mongoDB fetch code from MongoUTL to MongoURL num-16
