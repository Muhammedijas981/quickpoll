"use client";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { usePollStore } from "@/store/pollStore";

interface LikeButtonProps {
  pollId: string;
  initialLikes: number;
  onLike: (pollId: string) => Promise<void>;
}

export function LikeButton({ pollId, initialLikes, onLike }: LikeButtonProps) {
  const polls = usePollStore((state) => state.polls);
  const currentPoll = usePollStore((state) => state.currentPoll);

  // Get live likes from store
  const poll = polls.find((p) => p.id === pollId) || currentPoll;
  const likes = poll?.likes ?? initialLikes;

  const [isLiked, setIsLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLike = async () => {
    if (isLiked || isLoading) return;

    setIsLoading(true);
    try {
      await onLike(pollId);
      setIsLiked(true);
    } catch (error) {
      console.error("Failed to like poll:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleLike}
      disabled={isLiked || isLoading}
      className={cn("gap-2", isLiked && "text-red-500")}
    >
      <Heart className={cn("w-4 h-4", isLiked && "fill-current")} />
      <span>{likes}</span>
    </Button>
  );
}
