import type { Id } from "@/convex/_generated/dataModel";

export type CommentMode = "view" | "comment";

export type CommentMessage = {
  _id: Id<"commentMessages">;
  _creationTime: number;
  threadId: Id<"commentThreads">;
  body: string;
  authorId: string;
  authorName: string;
  authorImage?: string;
  editedAt?: number;
};

export type CommentThread = {
  _id: Id<"commentThreads">;
  _creationTime: number;
  pageKey: string;
  anchorId: string;
  relX: number;
  relY: number;
  status: "open" | "resolved";
  createdBy: string;
  createdByName: string;
  createdByImage?: string;
  resolvedBy?: string;
  resolvedAt?: number;
  updatedAt: number;
  messages: CommentMessage[];
};

export type DraftPin = {
  anchorId: string;
  relX: number;
  relY: number;
  // Absolute screen position captured at drop time, used only to anchor the
  // composer popover until the thread is persisted.
  clientX: number;
  clientY: number;
};
