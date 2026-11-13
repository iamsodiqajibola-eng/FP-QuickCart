// errorHandler.ts
// The last middleware: Turn any error thrown in a route into a json, then reply with the right status code, so the server never crashed and the website always get .....{message: "..."}

// Step 14: Handle unknown  URLs ans errors
// notfound.ts answers "no route matched": this file answers " a route matched but something went wrong"

import type { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/AppError";
import mongoose from "mongoose";

export const errorHandler = (
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction, // not used, but express only treats a middleware as an error handler when it has 4 parameters
) => {
  // 1. Our own Errors: throw new AppError(404, "Product not found")
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({ message: error.message }); // check this out
  }

  // 2. A record broke the model rules (e.g required field missing, price below 0)

  if (error instanceof mongoose.Error.ValidationError) {
    const message = Object.values(error.errors).map((field) => {
      return field.message;
    });

    return res.status(400).json({ message: message.join(". ") });
  }

  // 3. A badly formed id, e.g Get /apiproduct123 ("123" is not a mongoDB id)

  if (error instanceof mongoose.Error.CastError) {
    return res
      .status(400)
      .json({ message: `Invalid ${error.path}: ${String(error.value)}` });
  }

  // The remaining errors arent classes we can check with instanceof, so we look at thier fields

  const err = error as {
    code?: number;
    keyValue?: Record<string, unknown>;
    type?: string;
    name?: string;
  };

  // 4. A Unigque field already used , e.g registration with an emall that exists (MongoDB code 11000)

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue ?? {})[0] ?? "values";
    return res
      .status(409)
      .json({ message: `That ${field} is already in use.` });
  }

  // 5.) The Website sent broken JSON (express.json() couldnt read the body)
  if (err.type === "entity.parse.failed") {
    return res
      .status(400)
      .json({ message: "The request body is not valid Json" });
  }

  // 6. A bad or expired login token

  if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
    return res
      .status(401)
      .json({ message: "Your session has expired. Please Log in the again" });
  }

  // 7.) Anything else is a bug on our side: log the details for us, send a polite message to the user (never send real error to broswer, it can how the server works)

  console.error(error);
  return res
    .status(500)
    .json({ message: "Something went wrong on our side. Please try again" });
};
