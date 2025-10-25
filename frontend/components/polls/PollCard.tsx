"use client";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LikeButton } from "@/components/common/LikeButton";
import { Poll } from "@/types/poll";
import { formatDate } from "@/lib/utils";
import { BarChart3, Users } from "lucide-react";
import { pollsApi } from "@/lib/api";
import { usePollStore } from "@/store/pollStore";
import { useEffect, useState } from "react";

interface PollCardProps {
  poll: Poll;
}

export function PollCard({ poll: initialPoll }: PollCardProps) {
  const polls = usePollStore((state) => state.polls);

  // Find the latest version of this poll from the store
  const poll = polls.find((p) => p.id === initialPoll.id) || initialPoll;

  const handleLike = async (pollId: string) => {
    await pollsApi.likePoll(pollId);
  };

  return (
    <Link href={`/polls/${poll.id}`}>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="line-clamp-2">{poll.title}</CardTitle>
            <Badge variant="secondary" className="shrink-0">
              <Users className="w-3 h-3 mr-1" />
              {poll.totalVotes}
            </Badge>
          </div>
          {poll.description && (
            <CardDescription className="line-clamp-2">
              {poll.description}
            </CardDescription>
          )}
        </CardHeader>

        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <BarChart3 className="w-4 h-4" />
              <span>{poll.options.length} options</span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">
            {formatDate(poll.createdAt)}
          </span>
          <div onClick={(e) => e.preventDefault()}>
            <LikeButton
              pollId={poll.id}
              initialLikes={poll.likes}
              onLike={handleLike}
            />
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
