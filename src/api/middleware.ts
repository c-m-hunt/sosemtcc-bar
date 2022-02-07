import { Request, Response, NextFunction } from "express";

const allowedToken = process.env.API_AUTH_TOKEN;

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.header("authorization");
  if (!token || !allowedToken) {
    res.status(401).send();
  }
  if (token?.replace("Bearer ", "").trim() === allowedToken) {
    next();
  } else {
    res.status(401).send();
  }
};
