import { PrismaClient } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
const prisma = new PrismaClient();

const checkToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers["x-access-token"];
  // decode token
  if (token) {
    // verifies secret and checks exp
    jwt.verify(
      token as string,
      process.env.TOKEN_SECRET as string,
      async (err: any, decoded: any) => {
        if (err) {
          console.log(err);

          return res
            .status(401)
            .json({ error: true, message: "Unauthorized access." });
        }

        const tokenCheck = await prisma.token.findFirst({
          where: {
            token: token as string,
            user: {
              id: decoded.id,
            },
          },
        });

        if (!tokenCheck) {
          return res
            .status(401)
            .json({ error: true, message: "Unauthorized access." });
        }

        next();
      }
    );
  } else {
    // if there is no token
    // return an error
    return res.status(403).send({
      error: true,
      message: "No token provided.",
    });
  }
};

export default checkToken;
