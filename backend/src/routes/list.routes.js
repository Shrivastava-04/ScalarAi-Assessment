import express from "express";
import { prisma } from "../db.js";

const router = express.Router();

// create list in board
router.post("/", async (req, res) => {
  try {
    const { boardId, title } = req.body;

    const count = await prisma.list.count({ where: { boardId } });

    const list = await prisma.list.create({
      data: {
        title,
        boardId,
        order: count + 1,
      },
    });

    res.json(list);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// rename list
router.patch("/:listId", async (req, res) => {
  try {
    const { listId } = req.params;
    const { title } = req.body;

    const list = await prisma.list.update({
      where: { id: listId },
      data: { title },
    });

    res.json(list);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// delete list
router.delete("/:listId", async (req, res) => {
  try {
    const { listId } = req.params;

    await prisma.list.delete({ where: { id: listId } });

    res.json({ message: "List deleted ✅" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
