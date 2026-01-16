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

export default router;
