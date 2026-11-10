//notFound
//Runs when no route matches the request and replies with a 404 message.
import { Request, Response } from "express";
// STep 4: Handle unknowsn Urls and errors
// Runs when no Route matched: replies 404 as Json. Errorhandlers.ts (same step) it turns any thrown error into a json reply insted of crahsing

export const notfound = (req: Request, res: Response) => {
  res
    .status(404)
    .json({ message: `Not Found: ${req.method} ${req.originalUrl}` });
};
