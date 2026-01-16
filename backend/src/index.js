import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import boardRoutes from "./routes/board.routes.js";
import listRoutes from "./routes/list.routes.js";
import cardRoutes from "./routes/card.routes.js";
import dndRoutes from "./routes/dnd.routes.js";
import cardDetailsRoutes from "./routes/cardDetails.routes.js";

dotenv.config();

const app = express();

// ✅ Middlewares
app.use(cors());
app.use(express.json());

// ✅ Health check route
app.get("/", (req, res) => {
  res.json({ message: "Trello Clone Backend running ✅" });
});

// ✅ API Routes
app.use("/api/boards", boardRoutes);
app.use("/api/lists", listRoutes);
app.use("/api/cards", cardRoutes);
app.use("/api/dnd", dndRoutes);
app.use("/api/card-details", cardDetailsRoutes);

// ✅ Fallback route for unknown endpoints
app.use((req, res) => {
  res.status(404).json({ message: "Route not found ❌" });
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
