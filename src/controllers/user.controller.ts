import { Request, Response } from "express";
import { Prisma, PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
const prisma = new PrismaClient();
import jwt from "jsonwebtoken";

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

const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findFirst({
      where: {
        email,
      },
      include: {
        posts: true,
        followers: true,
        following: true,
      },
    });

    if (!user) {
      return res
        .status(400)
        .json({ error: true, message: "Credentials are incorrect!" });
    }

    if (!bcrypt.compareSync(password, user.password!)) {
      return res
        .status(400)
        .json({ error: true, message: "Credentials are incorrect!" });
    }

    const userData = {
      id: user.id,
      email: user.email!,
      name: user.name!,
    };

    const token = jwt.sign(userData, process.env.TOKEN_SECRET as string, {
      expiresIn: Number(process.env.TOKEN_LIFE),
    });

    const refreshToken = jwt.sign(
      userData,
      process.env.REFRESH_TOKEN_SECRET as string,
      {
        expiresIn: Number(process.env.REFRESH_TOKEN_LIFE),
      }
    );

    await prisma.token.create({
      data: {
        token,
        refreshToken,
        user: {
          connect: {
            id: user.id,
          },
        },
      },
    });

    return res.status(200).json({
      error: false,
      message: "Login successful!",
      user,
      token,
      refreshToken,
    });
  } catch (e: any) {
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

        include: {
          posts: true,
          followers: true,
          following: true,
        },
      });
      return res
        .status(200)
        .json({ error: false, message: "User found successfully!", user });
    }

    const users = await prisma.user.findMany({
      include: {
        posts: true,
        followers: true,
        following: true,
      },
    });

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

const refresh = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    const token = await prisma.token.findFirst({
      where: {
        refreshToken,
      },
    });

    if (!token) {
      return res.status(400).json({ error: true, message: "Token not found!" });
    }

    const user = await prisma.user.findFirst({
      where: {
        id: token.userId,
      },
    });

    if (!user) {
      return res.status(400).json({ error: true, message: "User not found!" });
    }

    const userData = {
      id: user.id,
      email: user.email!,
      name: user.name!,
    };

    const newToken = jwt.sign(userData, process.env.TOKEN_SECRET as string, {
      expiresIn: Number(process.env.TOKEN_LIFE),
    });

    await prisma.token.update({
      where: {
        id: token.id,
      },
      data: {
        token: newToken,
      },
    });

    return res.status(200).json({
      error: false,
      message: "Token refreshed successfully!",
      token: newToken,
    });
  } catch (e: any) {
    return res.status(500).json({ error: true, message: e.message });
  }
};

const logout = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    const token = await prisma.token.findFirst({
      where: {
        refreshToken,
      },
    });

    if (!token) {
      return res.status(400).json({ error: true, message: "Token not found!" });
    }

    await prisma.token.delete({
      where: {
        id: token.id,
      },
    });

    return res
      .status(200)
      .json({ error: false, message: "Logout successful!" });
  } catch (e: any) {
    return res.status(500).json({ error: true, message: e.message });
  }
};

const follow = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { user_id } = req.body;

    const follower = await prisma.user.findFirst({
      where: {
        id: Number(user_id),
      },
    });

    if (!follower) {
      return res.status(400).json({ error: true, message: "User not found!" });
    }

    const following = await prisma.user.findFirst({
      where: {
        id: Number(id),
      },
    });

    if (!following) {
      return res.status(400).json({ error: true, message: "User not found!" });
    }

    const followCheck = await prisma.follows.findFirst({
      where: {
        followerId: Number(user_id),
        followingId: Number(id),
      },
    });

    if (followCheck) {
      await prisma.follows.delete({
        where: {
          id: followCheck.id,
        },
      });

      await prisma.user.update({
        where: {
          id: Number(id),
        },
        data: {
          followerCount: following.followerCount - 1,
        },
      });

      await prisma.user.update({
        where: {
          id: Number(user_id),
        },
        data: {
          followingCount: follower.followingCount - 1,
        },
      });

      return res
        .status(200)
        .json({ error: false, message: "Unfollow successful!" });
    }

    await prisma.follows.create({
      data: {
        follower: {
          connect: {
            id: Number(user_id),
          },
        },
        following: {
          connect: {
            id: Number(id),
          },
        },
      },
    });

    await prisma.user.update({
      where: {
        id: Number(id),
      },
      data: {
        followerCount: following.followerCount + 1,
      },
    });

    await prisma.user.update({
      where: {
        id: Number(user_id),
      },
      data: {
        followingCount: follower.followingCount + 1,
      },
    });

    return res
      .status(200)
      .json({ error: false, message: "Follow successful!" });
  } catch (e: any) {
    return res.status(500).json({ error: true, message: e.message });
  }
};

const feed = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findFirst({
      where: {
        id: Number(id),
      },
      include: {
        posts: true,
        followers: true,
        following: true,
      },
    });

    if (!user) {
      return res.status(400).json({ error: true, message: "User not found!" });
    }

    const following = await prisma.follows.findMany({
      where: {
        followerId: Number(id),
      },
      select: {
        followingId: true,
      },
    });

    // Get all followingIds and put it in a array of numbers
    const followingIds = following.map((follow) => follow.followingId);

    const getPostsbyFollowingIds = await prisma.post.findMany({
      where: {
        authorId: {
          in: followingIds,
        },
        published: true,
      },
      include: {
        author: true,
        likes: true,
        comments: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const popularUsers = await prisma.user.findMany({
      orderBy: {
        followerCount: "desc",
      },
      take: 10,
    });

    const popularUserIds = popularUsers.map((user) => user.id);

    const popularPosts = await prisma.post.findMany({
      where: {
        authorId: {
          in: popularUserIds,
        },
        published: true,
      },
      include: {
        author: true,
        likes: true,
        comments: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const remainingPosts = await prisma.post.findMany({
      include: {
        author: true,
        likes: true,
        comments: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const allPosts = [
      ...getPostsbyFollowingIds,
      ...popularPosts,
      ...remainingPosts,
    ];

    // remove duplicates
    const feed = allPosts.filter(
      (v, i, a) => a.findIndex((v2) => v2.id === v.id) === i
    );

    res.json({
      error: false,
      message: "Feed found successfully!",
      feed,
    });
  } catch (e: any) {
    return res.status(500).json({ error: true, message: e.message });
  }
};

const popularUsers = async (req: Request, res: Response) => {
  try {
  } catch (e: any) {
    return res.status(500).json({ error: true, message: e.message });
  }
};

export default {
  add,
  get,
  update,
  remove,
  login,
  refresh,
  logout,
  follow,
  feed,
};
