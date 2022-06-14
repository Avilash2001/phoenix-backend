import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";

const checkValidatorErrors = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ error: true, message: errors.array() });
  }
  next();
};

export default checkValidatorErrors;
