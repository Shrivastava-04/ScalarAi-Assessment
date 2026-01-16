import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { api } from "../api/api";
import { createPortal } from "react-dom";

function DraggablePortal({ isDragging, children }) {
  if (!isDragging) return children;
  return createPortal(children, document.body);
}

// ✅ AddList component
function AddList({ boardId, onCreated }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  const createList = async () => {
    if (!title.trim()) return;

    setLoading(true);
    await api.post("/lists", { boardId, title });

    setTitle("");
    setOpen(false);
    setLoading(false);

    onCreated();
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="w-[280px] shrink-0 rounded-xl bg-white/15 hover:bg-white/20 px-4 py-3 text-left text-sm font-medium"
      >
        + Add another list
      </button>
    );
  }

  return (
    <div className="w-[280px] shrink-0 rounded-xl bg-[#22252b] p-3">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter list title..."
        className="w-full bg-white/10 rounded-lg px-3 py-2 outline-none text-sm"
        autoFocus
        disabled={loading}
      />

      <div className="flex gap-2 mt-2">
        <button
          onClick={createList}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-500 px-3 py-2 rounded-lg text-sm font-medium disabled:opacity-60"
        >
          {loading ? "Adding..." : "Add list"}
        </button>

        <button
          onClick={() => {
            setOpen(false);
            setTitle("");
          }}
          disabled={loading}
          className="px-3 py-2 rounded-lg text-sm bg-white/10 hover:bg-white/15 disabled:opacity-60"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

// ✅ AddCard component
function AddCard({ listId, onCreated }) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");

  const createCard = async () => {
    if (!title.trim()) return;
    setLoading(true);

    await api.post("/cards", { listId, title });

    setTitle("");
    setOpen(false);
    setLoading(false);

    onCreated();
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="text-sm mt-3 w-full text-left px-2 py-2 rounded-lg bg-white/5 hover:bg-white/10"
      >
        + Add a card
      </button>
    );
  }

  return (
    <div className="mt-3">
      <textarea
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter a title for this card..."
        className="w-full bg-white/10 rounded-lg px-3 py-2 outline-none text-sm resize-none"
        rows={3}
        autoFocus
      />
      <div className="flex gap-2 mt-2">
        <button
          onClick={createCard}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-500 px-3 py-2 rounded-lg text-sm font-medium disabled:opacity-50"
        >
          {loading ? "Adding..." : "Add card"}
        </button>
        <button
          onClick={() => {
            setOpen(false);
            setTitle("");
          }}
          className="px-3 py-2 rounded-lg text-sm bg-white/10 hover:bg-white/15"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default function BoardPage() {
  const { boardId } = useParams();
  const navigate = useNavigate();

  const [saving, setSaving] = useState(false);
  const [board, setBoard] = useState(null);

  const fetchBoard = async () => {
    const res = await api.get(`/boards/${boardId}`);
    setBoard(res.data);
  };

  useEffect(() => {
    fetchBoard();
  }, [boardId]);

  if (!board) {
    return (
      <div className="min-h-screen bg-[#1d1f23] text-white p-8">
        Loading board...
      </div>
    );
  }

  const onDragEnd = async (result) => {
    const { source, destination, type } = result;
    if (!destination) return;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    )
      return;

    // set saving true
    setSaving(true);

    try {
      // ✅ LIST MOVE
      if (type === "list") {
        const newLists = Array.from(board.lists);
        const [moved] = newLists.splice(source.index, 1);
        newLists.splice(destination.index, 0, moved);

        // update local state instantly (optimistic)
        setBoard({ ...board, lists: newLists });

        // backend sync
        await api.post("/dnd/list", {
          listId: moved.id,
          newOrder: destination.index + 1,
        });

        setSaving(false);
        return;
      }

      // ✅ CARD MOVE
      const sourceListId = source.droppableId;
      const destListId = destination.droppableId;

      const newBoard = structuredClone(board);

      const sourceList = newBoard.lists.find((l) => l.id === sourceListId);
      const destList = newBoard.lists.find((l) => l.id === destListId);

      const [movedCard] = sourceList.cards.splice(source.index, 1);
      destList.cards.splice(destination.index, 0, movedCard);

      // update UI instantly
      setBoard(newBoard);

      // backend sync
      await api.post("/dnd/card", {
        cardId: movedCard.id,
        sourceListId,
        destListId,
        destOrder: destination.index + 1,
      });

      setSaving(false);
    } catch (err) {
      console.error(err);
      setSaving(false);

      // fallback: reload correct board state
      fetchBoard();
    }
  };

  return (
    <div className="min-h-screen text-white relative ">
      {saving && (
        <div className="text-xs px-3 py-1 rounded-full bg-white/10 border border-white/10">
          Saving...
        </div>
      )}
      {/* Background (purple like trello screenshot) */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#2b2441] via-[#4b2c6b] to-[#82457b]" />

      {/* Top bar */}
      <div className="relative z-10 h-14 flex items-center px-4 border-b border-white/10 bg-black/20 backdrop-blur">
        <button
          onClick={() => navigate("/")}
          className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-sm"
        >
          ← Boards
        </button>

        <div className="ml-4 font-semibold text-lg">{board.title}</div>

        <div className="ml-auto flex items-center gap-2">
          <button className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-sm">
            Share
          </button>
          <div className="w-9 h-9 rounded-full bg-white/10 grid place-items-center text-xs">
            CK
          </div>
        </div>
      </div>

      {/* Lists area */}
      <div className="relative z-10 px-4 py-5 flex  items-start gap-4 ">
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="board" direction="horizontal" type="list">
            {(provided) => (
              <div
                className="flex gap-4 overflow-x-auto overflow-y-visible pb-4"
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {board.lists.map((list, index) => (
                  <Draggable key={list.id} draggableId={list.id} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className="w-[280px] shrink-0 rounded-xl bg-black/30 backdrop-blur border border-white/10"
                      >
                        {/* List Header */}
                        <div
                          className="px-3 py-3 flex items-center justify-between"
                          {...provided.dragHandleProps}
                        >
                          <div className="font-semibold text-sm">
                            {list.title}
                          </div>
                          <div className="text-white/50 text-sm">⋯</div>
                        </div>

                        {/* Cards */}
                        <Droppable droppableId={list.id} type="card">
                          {(provided) => (
                            <div
                              className="px-3 pb-3 flex flex-col gap-2 min-h-[40px]"
                              ref={provided.innerRef}
                              {...provided.droppableProps}
                            >
                              {list.cards.map((card, cardIndex) => (
                                <Draggable
                                  key={card.id}
                                  draggableId={card.id}
                                  index={cardIndex}
                                >
                                  {(provided, snapshot) => (
                                    <DraggablePortal
                                      isDragging={snapshot.isDragging}
                                    >
                                      <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        className="rounded-lg bg-[#1f2228] border border-white/10 px-3 py-2 hover:bg-[#272b33] cursor-pointer will-change-transform"
                                        style={{
                                          ...provided.draggableProps.style,
                                          transition: snapshot.isDropAnimating
                                            ? "transform 0.2s"
                                            : "none",
                                        }}
                                      >
                                        {/* Labels */}
                                        <div className="flex gap-2 mb-1 flex-wrap">
                                          {card.labels?.map((x) => (
                                            <span
                                              key={x.labelId}
                                              className="text-[10px] px-2 py-[2px] rounded-full bg-white/10"
                                            >
                                              {x.label.name}
                                            </span>
                                          ))}
                                        </div>

                                        <div className="text-sm font-medium">
                                          {card.title}
                                        </div>

                                        {/* Members */}
                                        {!!card.members?.length && (
                                          <div className="text-xs text-white/60 mt-1">
                                            {card.members
                                              .map((m) => m.member.name)
                                              .join(", ")}
                                          </div>
                                        )}
                                      </div>
                                    </DraggablePortal>
                                  )}
                                </Draggable>
                              ))}

                              {provided.placeholder}

                              {/* Add card */}
                              <AddCard
                                listId={list.id}
                                onCreated={fetchBoard}
                              />
                            </div>
                          )}
                        </Droppable>
                      </div>
                    )}
                  </Draggable>
                ))}

                {provided.placeholder}

                {/* Add list */}
              </div>
            )}
          </Droppable>
        </DragDropContext>
        <AddList boardId={boardId} onCreated={fetchBoard} />
      </div>
    </div>
  );
}
