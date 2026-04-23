"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Id } from "@/convex/_generated/dataModel";
import type { CommentMode, DraftPin } from "./types";

interface CommentLayerState {
  pageKey: string;
  mode: CommentMode;
  setMode: (mode: CommentMode) => void;
  activeThreadId: Id<"commentThreads"> | null;
  setActiveThreadId: (id: Id<"commentThreads"> | null) => void;
  draftPin: DraftPin | null;
  setDraftPin: (pin: DraftPin | null) => void;
  panelOpen: boolean;
  setPanelOpen: (open: boolean) => void;
}

const CommentLayerContext = createContext<CommentLayerState | null>(null);

export function CommentLayerProvider({
  pageKey,
  children,
}: {
  pageKey: string;
  children: ReactNode;
}) {
  const [mode, setMode] = useState<CommentMode>("view");
  const [activeThreadId, setActiveThreadId] =
    useState<Id<"commentThreads"> | null>(null);
  const [draftPin, setDraftPin] = useState<DraftPin | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);

  const setModeWithReset = useCallback((next: CommentMode) => {
    setMode(next);
    if (next === "view") {
      setDraftPin(null);
    }
  }, []);

  const value = useMemo<CommentLayerState>(
    () => ({
      pageKey,
      mode,
      setMode: setModeWithReset,
      activeThreadId,
      setActiveThreadId,
      draftPin,
      setDraftPin,
      panelOpen,
      setPanelOpen,
    }),
    [pageKey, mode, setModeWithReset, activeThreadId, draftPin, panelOpen],
  );

  return (
    <CommentLayerContext.Provider value={value}>
      {children}
    </CommentLayerContext.Provider>
  );
}

export function useCommentLayer(): CommentLayerState {
  const ctx = useContext(CommentLayerContext);
  if (!ctx) {
    throw new Error("useCommentLayer must be used inside CommentLayerProvider");
  }
  return ctx;
}
