import express from "express";
import { prisma } from "../db.js";

const router = express.Router();

// Create card in list
router.post("/", async (req, res) => {
  try {
    const { listId, title } = req.body;

    const count = await prisma.card.count({ where: { listId } });

    const card = await prisma.card.create({
      data: {
        title,
        listId,
        order: count + 1,
      },
    });

    res.json(card);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// update card (title, desc, dueDate)
router.patch("/:cardId", async (req, res) => {
  try {
    const { cardId } = req.params;
    const { title, description, dueDate } = req.body;

    const card = await prisma.card.update({
      where: { id: cardId },
      data: {
        ...(title !== undefined ? { title } : {}),
        ...(description !== undefined ? { description } : {}),
        ...(dueDate !== undefined
          ? { dueDate: dueDate ? new Date(dueDate) : null }
          : {}),
      },
    });

    res.json(card);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

//  delete card
router.delete("/:cardId", async (req, res) => {
  try {
    const { cardId } = req.params;

    await prisma.card.delete({ where: { id: cardId } });

    res.json({ message: "Card deleted ✅" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
