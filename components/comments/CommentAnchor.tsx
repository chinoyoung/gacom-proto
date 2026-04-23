import type { ReactNode } from "react";

interface CommentAnchorProps {
  id: string;
  children: ReactNode;
  className?: string;
}

export function CommentAnchor({ id, children, className }: CommentAnchorProps) {
  return (
    <div data-comment-anchor={id} className={`relative ${className ?? ""}`.trim()}>
      {children}
    </div>
  );
}
