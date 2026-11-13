// AppError.ts
// An  Error with an Http status code attached, e.g throws new app error(404, "Product not found")
// errorHandler.ts replies with that status and message.

// Step 14 : One place to handle errors

export class AppError extends Error {
  statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message); // let the normal Error store the message
    this.statusCode = statusCode;
  }
}
