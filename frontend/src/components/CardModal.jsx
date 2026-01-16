import { useEffect, useMemo, useState } from "react";
import { api } from "../api/api";

export default function CardModal({
  open,
  onClose,
  board,
  card,
  refreshBoard,
}) {
  const [title, setTitle] = useState(card?.title || "");
  const [description, setDescription] = useState(card?.description || "");
  const [dueDate, setDueDate] = useState(card?.dueDate || null);

  const [saving, setSaving] = useState(false);

  // checklist input
  const [checkText, setCheckText] = useState("");
  const [addingCheck, setAddingCheck] = useState(false);

  // close on ESC
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  // sync values when card changes
  useEffect(() => {
    setTitle(card?.title || "");
    setDescription(card?.description || "");
    setDueDate(card?.dueDate || null);
  }, [card]);

  const cardLabelIds = useMemo(() => {
    return new Set((card?.labels || []).map((x) => x.labelId));
  }, [card]);

  const cardMemberIds = useMemo(() => {
    return new Set((card?.members || []).map((x) => x.memberId));
  }, [card]);

  if (!open || !card) return null;

  // ---------- HELPERS ----------
  const saveCard = async (payload) => {
    setSaving(true);
    try {
      await api.patch(`/cards/${card.id}`, payload);
      await refreshBoard();
    } finally {
      setSaving(false);
    }
  };

  const toggleLabel = async (labelId) => {
    setSaving(true);
    try {
      if (cardLabelIds.has(labelId)) {
        await api.delete(`/card-details/${card.id}/labels/${labelId}`);
      } else {
        await api.post(`/card-details/${card.id}/labels`, { labelId });
      }
      await refreshBoard();
    } finally {
      setSaving(false);
    }
  };

  const toggleMember = async (memberId) => {
    setSaving(true);
    try {
      if (cardMemberIds.has(memberId)) {
        await api.delete(`/card-details/${card.id}/members/${memberId}`);
      } else {
        await api.post(`/card-details/${card.id}/members`, { memberId });
      }
      await refreshBoard();
    } finally {
      setSaving(false);
    }
  };

  const addChecklist = async () => {
    if (!checkText.trim()) return;
    setAddingCheck(true);
    try {
      await api.post(`/card-details/${card.id}/checklist`, {
        text: checkText.trim(),
      });
      setCheckText("");
      await refreshBoard();
    } finally {
      setAddingCheck(false);
    }
  };

  const toggleChecklistItem = async (itemId, done) => {
    setSaving(true);
    try {
      await api.patch(`/card-details/checklist/${itemId}`, { done: !done });
      await refreshBoard();
    } finally {
      setSaving(false);
    }
  };

  const deleteChecklistItem = async (itemId) => {
    setSaving(true);
    try {
      await api.delete(`/card-details/checklist/${itemId}`);
      await refreshBoard();
    } finally {
      setSaving(false);
    }
  };

  // ---------- UI ----------
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/70 p-4 overflow-auto">
      {/* click outside */}
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-4xl mt-10 rounded-2xl bg-[#1f2228] border border-white/10 shadow-2xl">
        {/* header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold">Card</h2>
            {saving && (
              <span className="text-xs px-3 py-1 rounded-full bg-white/10 border border-white/10">
                Saving...
              </span>
            )}
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-lg bg-white/10 hover:bg-white/15"
          >
            ✕
          </button>
        </div>

        {/* body */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_320px] gap-6 p-6">
          {/* left */}
          <div className="space-y-6">
            {/* Title */}
            <div>
              <div className="text-sm text-white/60 mb-2">Title</div>
              <input
                className="w-full h-11 rounded-xl bg-white/10 border border-white/10 px-4 outline-none focus:border-white/30"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={() => saveCard({ title })}
              />
            </div>

            {/* Description */}
            <div>
              <div className="text-sm text-white/60 mb-2">Description</div>
              <textarea
                className="w-full rounded-xl bg-white/10 border border-white/10 px-4 py-3 outline-none focus:border-white/30 resize-none"
                rows={6}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                onBlur={() => saveCard({ description })}
              />
            </div>

            {/* Checklist */}
            <div>
              <div className="flex items-center justify-between">
                <div className="text-sm text-white/60 mb-2">Checklist</div>
              </div>

              <div className="space-y-2">
                {(card.checklist || []).map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-3 py-2"
                  >
                    <input
                      type="checkbox"
                      checked={item.done}
                      onChange={() => toggleChecklistItem(item.id, item.done)}
                      className="w-4 h-4"
                    />
                    <div
                      className={`text-sm flex-1 ${
                        item.done ? "line-through text-white/50" : ""
                      }`}
                    >
                      {item.text}
                    </div>
                    <button
                      onClick={() => deleteChecklistItem(item.id)}
                      className="text-xs px-2 py-1 rounded-lg bg-white/10 hover:bg-white/15"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>

              <div className="mt-3 flex gap-2">
                <input
                  value={checkText}
                  onChange={(e) => setCheckText(e.target.value)}
                  placeholder="Add checklist item..."
                  className="flex-1 h-10 rounded-xl bg-white/10 border border-white/10 px-3 outline-none"
                />
                <button
                  onClick={addChecklist}
                  disabled={addingCheck}
                  className="h-10 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-60"
                >
                  {addingCheck ? "Adding..." : "Add"}
                </button>
              </div>
            </div>
          </div>

          {/* right */}
          <div className="space-y-6">
            {/* Due date */}
            <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
              <div className="text-sm font-semibold mb-3">Due date</div>
              <input
                type="datetime-local"
                className="w-full h-10 rounded-xl bg-white/10 border border-white/10 px-3 outline-none"
                value={
                  dueDate ? new Date(dueDate).toISOString().slice(0, 16) : ""
                }
                onChange={(e) => {
                  const val = e.target.value;
                  const iso = val ? new Date(val).toISOString() : null;
                  setDueDate(iso);
                }}
                onBlur={() => saveCard({ dueDate })}
              />
              <button
                className="mt-3 w-full h-10 rounded-xl bg-white/10 hover:bg-white/15 text-sm"
                onClick={() => {
                  setDueDate(null);
                  saveCard({ dueDate: null });
                }}
              >
                Remove due date
              </button>
            </div>

            {/* Labels */}
            <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
              <div className="text-sm font-semibold mb-3">Labels</div>

              <div className="space-y-2">
                {board.labels.map((label) => (
                  <button
                    key={label.id}
                    onClick={() => toggleLabel(label.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl border text-sm
                      ${
                        cardLabelIds.has(label.id)
                          ? "bg-white/15 border-white/20"
                          : "bg-white/5 border-white/10 hover:bg-white/10"
                      }`}
                  >
                    <span>{label.name}</span>
                    <span className="text-xs opacity-70">
                      {cardLabelIds.has(label.id) ? "✓" : ""}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Members */}
            <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
              <div className="text-sm font-semibold mb-3">Members</div>

              <div className="space-y-2">
                {/* NOTE: We used seeded members only, later can be dynamic */}
                {["Harshit", "Rahul"].map((name, idx) => {
                  const memberId =
                    idx === 0
                      ? "651f939e-6aa5-4c15-91d1-db00b87b82c4"
                      : "c9107c36-828c-4ee9-96c5-e264f2a9f927";

                  return (
                    <button
                      key={memberId}
                      onClick={() => toggleMember(memberId)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl border text-sm
                      ${
                        cardMemberIds.has(memberId)
                          ? "bg-white/15 border-white/20"
                          : "bg-white/5 border-white/10 hover:bg-white/10"
                      }`}
                    >
                      <span>{name}</span>
                      <span className="text-xs opacity-70">
                        {cardMemberIds.has(memberId) ? "✓" : ""}
                      </span>
                    </button>
                  );
                })}
              </div>

              <p className="text-xs text-white/50 mt-3">
                (Members list can be made dynamic later)
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
