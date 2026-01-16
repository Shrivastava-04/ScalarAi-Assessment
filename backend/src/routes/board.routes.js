import express from "express";
import { prisma } from "../db.js";

const router = express.Router();

// Get full board (lists + cards)
router.get("/:boardId", async (req, res) => {
  try {
    const { boardId } = req.params;

    const board = await prisma.board.findUnique({
      where: { id: boardId },
      include: {
        labels: true,
        lists: {
          orderBy: { order: "asc" },
          include: {
            cards: {
              orderBy: { order: "asc" },
              include: {
                labels: { include: { label: true } },
                members: { include: { member: true } },
                checklist: { orderBy: { order: "asc" } },
              },
            },
          },
        },
      },
    });

    if (!board) return res.status(404).json({ message: "Board not found" });

    res.json(board);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Get all boards (Home page)
router.get("/", async (req, res) => {
  try {
    const boards = await prisma.board.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        createdAt: true,
      },
    });

    res.json(boards);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Create new board
router.post("/", async (req, res) => {
  try {
    const { title } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ message: "Board title is required" });
    }

    const board = await prisma.board.create({
      data: { title: title.trim() },
      select: {
        id: true,
        title: true,
        createdAt: true,
      },
    });

    res.status(201).json(board);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
