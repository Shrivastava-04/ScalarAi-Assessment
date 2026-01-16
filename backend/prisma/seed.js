import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // clear old data
  await prisma.checklistItem.deleteMany();
  await prisma.cardMember.deleteMany();
  await prisma.cardLabel.deleteMany();
  await prisma.card.deleteMany();
  await prisma.list.deleteMany();
  await prisma.label.deleteMany();
  await prisma.member.deleteMany();
  await prisma.board.deleteMany();

  // create members
  const member1 = await prisma.member.create({
    data: { name: "Harshit", email: "harshit@example.com" },
  });

  const member2 = await prisma.member.create({
    data: { name: "Rahul", email: "rahul@example.com" },
  });

  // create board
  const board = await prisma.board.create({
    data: { title: "Scaler Trello Clone Board" },
  });

  // labels
  const label1 = await prisma.label.create({
    data: { name: "Urgent", color: "red", boardId: board.id },
  });

  const label2 = await prisma.label.create({
    data: { name: "Feature", color: "blue", boardId: board.id },
  });

  // lists
  const todo = await prisma.list.create({
    data: { title: "Todo", order: 1, boardId: board.id },
  });

  const doing = await prisma.list.create({
    data: { title: "Doing", order: 2, boardId: board.id },
  });

  const done = await prisma.list.create({
    data: { title: "Done", order: 3, boardId: board.id },
  });

  // cards
  const card1 = await prisma.card.create({
    data: {
      title: "Setup backend + DB",
      order: 1,
      listId: todo.id,
      description: "Connect Supabase, Prisma, migrations",
    },
  });

  const card2 = await prisma.card.create({
    data: {
      title: "Build drag-drop UI",
      order: 1,
      listId: doing.id,
      description: "Use @hello-pangea/dnd",
    },
  });

  // add labels to card
  await prisma.cardLabel.create({
    data: { cardId: card1.id, labelId: label1.id },
  });

  await prisma.cardLabel.create({
    data: { cardId: card2.id, labelId: label2.id },
  });

  // add members to cards
  await prisma.cardMember.create({
    data: { cardId: card1.id, memberId: member1.id },
  });

  await prisma.cardMember.create({
    data: { cardId: card2.id, memberId: member2.id },
  });

  console.log("✅ Seeding complete:", board.id);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
