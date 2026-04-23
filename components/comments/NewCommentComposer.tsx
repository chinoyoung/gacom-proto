"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { useUser } from "@clerk/nextjs";
import { api } from "@/convex/_generated/api";
import { useCommentLayer } from "./useCommentLayer";

export function NewCommentComposer() {
  const { pageKey, draftPin, setDraftPin, setMode, setActiveThreadId } =
    useCommentLayer();
  const { user } = useUser();
  const createThread = useMutation(api.comments.createThread);
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!draftPin) return null;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!body.trim() || !draftPin) return;
    setSubmitting(true);
    try {
      const threadId = await createThread({
        pageKey,
        anchorId: draftPin.anchorId,
        relX: draftPin.relX,
        relY: draftPin.relY,
        body: body.trim(),
      });
      setDraftPin(null);
      setBody("");
      setActiveThreadId(threadId);
      setMode("view");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      className="pointer-events-auto fixed z-[70]"
      style={{
        left: `${draftPin.clientX}px`,
        top: `${draftPin.clientY + 8}px`,
      }}
    >
      <form
        onSubmit={submit}
        className="bg-white rounded-xl shadow-lg border border-slate-200 p-3 w-72"
      >
        <div className="flex items-center gap-2 mb-2">
          {user?.imageUrl && (
            <img
              src={user.imageUrl}
              alt=""
              className="w-6 h-6 rounded-full"
            />
          )}
          <span className="text-xs font-semibold text-slate-700">
            {user?.fullName ?? user?.username ?? "You"}
          </span>
        </div>
        <textarea
          autoFocus
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Add a comment"
          rows={3}
          className="w-full text-sm text-slate-900 placeholder:text-slate-400 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 focus:border-cobalt-500 focus:outline-none resize-none"
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              setDraftPin(null);
            }
          }}
        />
        <div className="flex justify-end gap-2 mt-2">
          <button
            type="button"
            onClick={() => setDraftPin(null)}
            className="px-3 py-1 text-xs font-medium text-slate-600 hover:text-slate-900"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!body.trim() || submitting}
            className="px-3 py-1 text-xs font-semibold text-white bg-cobalt-500 rounded-md hover:bg-cobalt-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? "Posting…" : "Comment"}
          </button>
        </div>
      </form>
    </div>
  );
}
