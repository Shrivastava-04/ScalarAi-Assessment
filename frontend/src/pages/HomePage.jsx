import { useMemo, useState, useEffect } from "react";
import { api } from "../api/api.js";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const [boards, setBoards] = useState([]);
  const [query, setQuery] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newBoardName, setNewBoardName] = useState("");

  const filteredBoards = useMemo(() => {
    return boards.filter((b) =>
      (b?.title ?? "").toLowerCase().includes(query.toLowerCase())
    );
  }, [boards, query]);

  const fetchBoards = async () => {
    const res = await api.get("/boards");
    setBoards(res.data);
  };

  useEffect(() => {
    fetchBoards();
  }, []);

  const createBoard = async () => {
    if (!newBoardName.trim()) return;

    await api.post("/boards", {
      title: newBoardName.trim(),
    });

    setNewBoardName("");
    setIsCreateOpen(false);

    fetchBoards(); // refresh UI
  };

  return (
    <div className="min-h-screen bg-[#1d1f23] text-white">
      {/* Top Navbar */}
      <header className="h-14 border-b border-white/10 flex items-center px-4 gap-4">
        <div className="flex items-center gap-2 font-semibold text-lg">
          <div className="w-7 h-7 rounded bg-blue-500 grid place-items-center">
            <span className="text-sm">T</span>
          </div>
          <span className="opacity-90">Trello</span>
        </div>

        <div className="flex-1 flex justify-center">
          <div className="w-full max-w-2xl relative">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search"
              className="w-full h-9 rounded-md bg-white/10 border border-white/10 px-10 text-sm outline-none focus:border-white/20"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50">
              🔍
            </span>
          </div>
        </div>

        <button
          onClick={() => setIsCreateOpen(true)}
          className="h-9 px-4 rounded-md bg-blue-600 hover:bg-blue-500 text-sm font-medium"
        >
          Create
        </button>

        <div className="w-8 h-8 rounded-full bg-white/10 grid place-items-center text-xs">
          CK
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 min-h-[calc(100vh-56px)] border-r border-white/10 px-3 py-4 hidden md:block">
          <div className="space-y-2">
            <SidebarItem active label="Boards" />
            <SidebarItem label="Templates" />
            <SidebarItem label="Home" />
          </div>

          <div className="mt-6 border-t border-white/10 pt-4">
            <div className="text-xs uppercase tracking-widest text-white/40 mb-3">
              Workspaces
            </div>

            <div className="flex items-center gap-2 px-2 py-2 rounded-md bg-white/5">
              <div className="w-8 h-8 rounded bg-emerald-500 grid place-items-center font-semibold">
                T
              </div>
              <div className="text-sm font-medium">Trello Workspace</div>
            </div>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 px-4 md:px-10 py-8">
          <h2 className="text-lg font-semibold mb-4 opacity-90">Boards</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Create new board card */}
            <button
              onClick={() => setIsCreateOpen(true)}
              className="h-24 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition flex items-center justify-center text-sm font-medium"
            >
              + Create new board
            </button>

            {/* Boards */}
            {filteredBoards.map((board) => (
              <BoardCard key={board.id} board={board} />
            ))}
          </div>
        </main>
      </div>

      {/* Create Board Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl bg-[#22252b] border border-white/10 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg">Create board</h3>
              <button
                onClick={() => setIsCreateOpen(false)}
                className="text-white/70 hover:text-white"
              >
                ✕
              </button>
            </div>

            <label className="text-sm text-white/70">Board title</label>
            <input
              value={newBoardName}
              onChange={(e) => setNewBoardName(e.target.value)}
              placeholder="e.g. Project Alpha"
              className="mt-2 w-full h-10 rounded-lg bg-white/10 border border-white/10 px-3 outline-none focus:border-white/20"
              autoFocus
            />

            <div className="flex gap-2 mt-5">
              <button
                onClick={createBoard}
                className="flex-1 h-10 rounded-lg bg-blue-600 hover:bg-blue-500 font-medium"
              >
                Create
              </button>
              <button
                onClick={() => setIsCreateOpen(false)}
                className="h-10 px-4 rounded-lg bg-white/10 hover:bg-white/15"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SidebarItem({ label, active }) {
  return (
    <div
      className={`px-3 py-2 rounded-md text-sm cursor-pointer ${
        active
          ? "bg-blue-600/20 text-blue-200"
          : "text-white/70 hover:bg-white/5"
      }`}
    >
      {label}
    </div>
  );
}

function BoardCard({ board }) {
  const navigate = useNavigate();
  const gradients = [
    "from-purple-500 to-pink-400",
    "from-sky-500 to-blue-500",
    "from-emerald-500 to-teal-400",
    "from-orange-500 to-rose-500",
  ];

  const g = gradients[board.id.charCodeAt(0) % gradients.length];

  return (
    <div
      onClick={() => navigate(`/board/${board.id}`)}
      className={`h-24 rounded-xl p-3 bg-linear-to-r ${g} cursor-pointer hover:opacity-95 transition`}
    >
      <div className="font-semibold text-sm">{board.title}</div>
    </div>
  );
}
