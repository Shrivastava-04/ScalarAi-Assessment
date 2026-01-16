import express from "express";
import { prisma } from "../db.js";

const router = express.Router();

/**
 * LABELS
 */

// attach label to card
router.post("/:cardId/labels", async (req, res) => {
  try {
    const { cardId } = req.params;
    const { labelId } = req.body;

    const added = await prisma.cardLabel.create({
      data: { cardId, labelId },
    });

    res.status(201).json(added);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// remove label from card
router.delete("/:cardId/labels/:labelId", async (req, res) => {
  try {
    const { cardId, labelId } = req.params;

    await prisma.cardLabel.delete({
      where: { cardId_labelId: { cardId, labelId } },
    });

    res.json({ message: "Label removed ✅" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * MEMBERS
 */

// attach member
router.post("/:cardId/members", async (req, res) => {
  try {
    const { cardId } = req.params;
    const { memberId } = req.body;

    const added = await prisma.cardMember.create({
      data: { cardId, memberId },
    });

    res.status(201).json(added);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// remove member
router.delete("/:cardId/members/:memberId", async (req, res) => {
  try {
    const { cardId, memberId } = req.params;

    await prisma.cardMember.delete({
      where: { cardId_memberId: { cardId, memberId } },
    });

    res.json({ message: "Member removed ✅" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * CHECKLIST
 */

// add checklist item
router.post("/:cardId/checklist", async (req, res) => {
  try {
    const { cardId } = req.params;
    const { text } = req.body;

    const count = await prisma.checklistItem.count({ where: { cardId } });

    const item = await prisma.checklistItem.create({
      data: {
        cardId,
        text,
        order: count + 1,
      },
    });

    res.status(201).json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// toggle checklist item done
router.patch("/checklist/:itemId", async (req, res) => {
  try {
    const { itemId } = req.params;
    const { done } = req.body;

    const updated = await prisma.checklistItem.update({
      where: { id: itemId },
      data: { done: !!done },
    });

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// delete checklist item
router.delete("/checklist/:itemId", async (req, res) => {
  try {
    const { itemId } = req.params;

    await prisma.checklistItem.delete({ where: { id: itemId } });

    res.json({ message: "Checklist item deleted ✅" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
