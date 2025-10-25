"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { VoteSection } from "@/components/polls/VoteSection";
import { PollResults } from "@/components/polls/PollResults";
import { LikeButton } from "@/components/common/LikeButton";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { ErrorMessage } from "@/components/common/ErrorMessage";
import { usePollStore } from "@/store/pollStore";
import { pollsApi } from "@/lib/api";
import { useWebSocket } from "@/hooks/useWebSocket";
import { formatDate } from "@/lib/utils";
import { ArrowLeft, Users } from "lucide-react";
import Link from "next/link";

export default function PollDetailPage() {
  const params = useParams();
  const router = useRouter();
  const pollId = params.id as string;

  const { currentPoll, setCurrentPoll } = usePollStore();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [hasVoted, setHasVoted] = useState(false);

  // Connect to WebSocket
  useWebSocket();

  useEffect(() => {
    const fetchPoll = async () => {
      setIsLoading(true);
      try {
        const data = await pollsApi.getPoll(pollId);
        setCurrentPoll(data);
        setError("");
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to fetch poll");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPoll();
  }, [pollId, setCurrentPoll]);

  const handleVote = async (pollId: string, optionId: string) => {
    await pollsApi.vote(pollId, optionId);
    setHasVoted(true);
  };

  const handleLike = async (pollId: string) => {
    await pollsApi.likePoll(pollId);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error || !currentPoll) {
    return (
      <div className="space-y-4">
        <ErrorMessage message={error || "Poll not found"} />
        <Link href="/polls">
          <Button variant="outline">Back to Polls</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Back Button */}
      <Link href="/polls">
        <Button variant="ghost" className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to Polls
        </Button>
      </Link>

      {/* Poll Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2 flex-1">
              <CardTitle className="text-2xl">{currentPoll.title}</CardTitle>
              {currentPoll.description && (
                <CardDescription className="text-base">
                  {currentPoll.description}
                </CardDescription>
              )}
            </div>
            <Badge variant="secondary" className="shrink-0">
              <Users className="w-3 h-3 mr-1" />
              {currentPoll.totalVotes}
            </Badge>
          </div>

          <div className="flex items-center gap-4 pt-4">
            <span className="text-sm text-muted-foreground">
              {formatDate(currentPoll.createdAt)}
            </span>
            <LikeButton
              pollId={currentPoll.id}
              initialLikes={currentPoll.likes}
              onLike={handleLike}
            />
          </div>
        </CardHeader>
      </Card>

      {/* Voting Section */}
      {!hasVoted ? (
        <Card>
          <CardHeader>
            <CardTitle>Cast Your Vote</CardTitle>
            <CardDescription>Select an option below</CardDescription>
          </CardHeader>
          <CardContent>
            <VoteSection
              pollId={currentPoll.id}
              options={currentPoll.options}
              onVote={handleVote}
            />
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-2 py-4">
              <p className="text-lg font-semibold text-primary">
                ✓ Vote Submitted!
              </p>
              <p className="text-muted-foreground">
                Thank you for participating
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <Separator />

      {/* Results Section */}
      <Card>
        <CardContent className="pt-6">
          <PollResults
            options={currentPoll.options}
            totalVotes={currentPoll.totalVotes}
          />
        </CardContent>
      </Card>
    </div>
  );
}
