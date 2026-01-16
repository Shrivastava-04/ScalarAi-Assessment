# Trello Clone (Full Stack)

A full-stack **Trello-like Kanban board** application built using **React (Vite)** for frontend, **Node.js + Express** for backend, and **PostgreSQL (Supabase)** as database with **Prisma ORM**.  
It supports **Boards → Lists → Cards** with drag & drop functionality.

---

## 🚀 Tech Stack

### Frontend

- React (Vite)
- Tailwind CSS
- Axios
- React Router DOM
- @hello-pangea/dnd (Drag & Drop)

### Backend

- Node.js
- Express.js
- Prisma ORM
- PostgreSQL (Supabase)

---

## ✨ Features Implemented

### ✅ Boards

- Home page showing all boards
- Create new board
- Open a board

### ✅ Lists

- Create list inside a board
- Update list title
- Delete list
- Drag & drop reorder lists

### ✅ Cards

- Create card inside a list
- Update card (title/description/due date)
- Delete card
- Drag & drop cards between lists and within list

### ✅ UI

- Trello-like home layout with sidebar and top bar
- Trello-like board page background with column layout

---

## 🗂️ Project Structure

trello-clone/
backend/
prisma/
schema.prisma
migrations/
seed.js
src/
routes/
board.routes.js
list.routes.js
card.routes.js
dnd.routes.js
db.js
index.js
.env
package.json

frontend/
src/
api/
api.js
pages/
HomePage.jsx
BoardPage.jsx
App.jsx
main.jsx
index.css
tailwind.config.js
postcss.config.js
package.json

yaml
Copy code

---

## ⚙️ Setup Instructions

### 1️⃣ Clone the repo

```bash
git clone <your-repo-url>
cd trello-clone
🛠 Backend Setup
2️⃣ Install backend dependencies
bash
Copy code
cd backend
npm install
3️⃣ Create .env file in backend
Create file: backend/.env

env
Copy code
PORT=5000
DATABASE_URL="YOUR_SUPABASE_DATABASE_URL"
DIRECT_URL="YOUR_SUPABASE_DIRECT_DATABASE_URL"
✅ Supabase connection string path:
Supabase Dashboard → Settings → Database → Connection string

Recommended format:

env
Copy code
DATABASE_URL="postgresql://postgres:<PASSWORD>@<HOST>:5432/postgres?pgbouncer=true&connection_limit=1&sslmode=require"
DIRECT_URL="postgresql://postgres:<PASSWORD>@<HOST>:5432/postgres?sslmode=require"
4️⃣ Prisma migration
bash
Copy code
npx prisma migrate dev --name init
5️⃣ Seed database
bash
Copy code
npm run seed
6️⃣ Run backend server
bash
Copy code
npm run dev
Backend runs at:

arduino
Copy code
http://localhost:5000
🎨 Frontend Setup
7️⃣ Install frontend dependencies
bash
Copy code
cd ../frontend
npm install
8️⃣ Run frontend
bash
Copy code
npm run dev
Frontend runs at:

arduino
Copy code
http://localhost:5173
🔗 API Endpoints
Health
GET /

Boards
GET /api/boards → get all boards

POST /api/boards → create board

GET /api/boards/:boardId → fetch full board with lists & cards

Lists
POST /api/lists → create list

PATCH /api/lists/:listId → rename/update list

DELETE /api/lists/:listId → delete list

Cards
POST /api/cards → create card

PATCH /api/cards/:cardId → update card (title/description/dueDate)

DELETE /api/cards/:cardId → delete card

Drag & Drop
POST /api/dnd/list → reorder list

POST /api/dnd/card → move/reorder card between lists

✅ How to Use
Open the app at http://localhost:5173

Create a new board from Home page

Open a board

Add lists and cards

Drag & drop lists/cards to reorder and move

👨‍💻 Author
Harshit Shrivastava
```
