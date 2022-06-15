import { Request, Response } from "express";
import { Prisma, PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const add = async (req: Request, res: Response) => {
  try {
    const { title, content, authorId } = req.body;
    await prisma.post.create({
      data: {
        title,
        content,
        published: true,
        author: { connect: { id: authorId } },
      },
    });
    return res
      .status(200)
      .json({ error: false, message: "Post created successfully!" });
  } catch (e: any) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2025") {
        return res
          .status(400)
          .json({ error: true, message: "User not found!" });
      }
    }
    return res.status(500).json({ error: true, message: e.message });
  }
};

const get = async (req: Request, res: Response) => {
  try {
    const { id, user_id } = req.query;

    if (id) {
      const post = await prisma.post.findFirst({
        where: {
          id: Number(id),
        },
        include: {
          likes: true,
          comments: true,
          author: true,
        },
      });
      return res
        .status(200)
        .json({ error: false, message: "Post found successfully!", post });
    }

    if (user_id) {
      const post = await prisma.post.findMany({
        where: {
          authorId: Number(user_id),
        },
        include: {
          likes: true,
          comments: true,
          author: true,
        },
      });

      return res
        .status(200)
        .json({ error: false, message: "Posts found successfully!", post });
    }

    const posts = await prisma.post.findMany({
      include: {
        likes: true,
        comments: true,
        author: true,
      },
    });

    return res
      .status(200)
      .json({ error: false, message: "posts found successfully!", posts });
  } catch (e: any) {
    return res.status(500).json({ error: true, message: e.message });
  }
};

const update = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;

    await prisma.post.update({
      where: {
        id: Number(id),
      },
      data: {
        title,
        content,
      },
    });

    return res
      .status(200)
      .json({ error: false, message: "Post updated successfully!" });
  } catch (e: any) {
    return res.status(500).json({ error: true, message: e.message });
  }
};

const remove = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.post.delete({
      where: {
        id: Number(id),
      },
    });

    return res

      .status(200)
      .json({ error: false, message: "Post deleted successfully!" });
  } catch (e: any) {
    return res.status(500).json({ error: true, message: e.message });
  }
};

const like = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { user_id } = req.body;

    const post = await prisma.post.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        likes: true,
      },
    });

    if (!post) {
      return res.status(400).json({ error: true, message: "Post not found!" });
    }

    const user = await prisma.user.findUnique({
      where: {
        id: Number(user_id),
      },
    });

    if (!user) {
      return res.status(400).json({ error: true, message: "User not found!" });
    }

    let likeId = 0;

    post &&
      post.likes.find(async (like: any) => {
        if (like.authorId === Number(user_id)) {
          likeId = like.id;
        }
        return like.authorId === Number(user_id);
      });

    if (likeId === 0) {
      await prisma.like.create({
        data: {
          post: { connect: { id: Number(id) } },
          author: { connect: { id: Number(user_id) } },
          userName: user.name,
        },
      });
      return res
        .status(200)
        .json({ error: false, message: "Post liked successfully!" });
    }

    await prisma.like.delete({
      where: {
        id: Number(likeId),
      },
    });

    return res
      .status(200)
      .json({ error: false, message: "Post unliked successfully!" });
  } catch (e: any) {
    return res.status(500).json({ error: true, message: e.message });
  }
};

const comment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { content, user_id } = req.body;

    if (content === "") {
      return res
        .status(400)
        .json({ error: true, message: "Content is empty!" });
    }

    const post = await prisma.post.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!post) {
      return res.status(400).json({ error: true, message: "Post not found!" });
    }

    const user = await prisma.user.findUnique({
      where: {
        id: Number(user_id),
      },
    });

    if (!user) {
      return res.status(400).json({ error: true, message: "User not found!" });
    }

    await prisma.comment.create({
      data: {
        post: { connect: { id: Number(id) } },
        author: { connect: { id: Number(user_id) } },
        userName: user.name,
        text: content,
      },
    });

    return res
      .status(200)
      .json({ error: false, message: "Comment created successfully!" });
  } catch (e: any) {
    return res.status(500).json({ error: true, message: e.message });
  }
};

export default {
  add,
  get,
  update,
  remove,
  like,
  comment,
};
