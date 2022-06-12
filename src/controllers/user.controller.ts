import { Request, Response } from "express";
import { Prisma, PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
const prisma = new PrismaClient();

const add = async (req: Request, res: Response) => {
  try {
    const query = {
      ...req.body,
      password: bcrypt.hashSync(req.body.password as string, 8),
    };

    await prisma.user.create({
      data: {
        ...query,
      },
    });

    return res
      .status(200)
      .json({ error: false, message: "User created successfully!" });
  } catch (e: any) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2002") {
        return res
          .status(400)
          .json({ error: true, message: "Email already exists!" });
      }
    }
    return res.status(500).json({ error: true, message: e.message });
  }
};

const get = async (req: Request, res: Response) => {
  try {
    const { id } = req.query;

    if (id) {
      const user = await prisma.user.findMany({
        where: {
          id: Number(id),
        },
      });
      return res
        .status(200)
        .json({ error: false, message: "User found successfully!", user });
    }

    const users = await prisma.user.findMany();

    return res
      .status(200)
      .json({ error: false, message: "Users found successfully!", users });
  } catch (e: any) {
    return res.status(500).json({ error: true, message: e.message });
  }
};

const update = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    await prisma.user.update({
      where: {
        id: Number(id),
      },
      data: {
        name,
      },
    });

    return res
      .status(200)
      .json({ error: false, message: "User updated successfully!" });
  } catch (e: any) {
    return res.status(500).json({ error: true, message: e.message });
  }
};

const remove = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.user.delete({
      where: {
        id: Number(id),
      },
    });

    return res
      .status(200)
      .json({ error: false, message: "User deleted successfully!" });
  } catch (e: any) {
    return res.status(500).json({ error: true, message: e.message });
  }
};

export default {
  add,
  get,
  update,
  remove,
};
