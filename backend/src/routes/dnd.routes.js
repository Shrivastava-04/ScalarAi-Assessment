import express from "express";
import { prisma } from "../db.js";

const router = express.Router();

// move/reorder cards (drag drop)
router.post("/card", async (req, res) => {
  try {
    const { cardId, sourceListId, destListId, destOrder } = req.body;

    // Move card to new list + new order
    const updated = await prisma.card.update({
      where: { id: cardId },
      data: { listId: destListId, order: destOrder },
    });

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// reorder lists
router.post("/list", async (req, res) => {
  try {
    const { listId, newOrder } = req.body;

    const updated = await prisma.list.update({
      where: { id: listId },
      data: { order: newOrder },
    });

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
