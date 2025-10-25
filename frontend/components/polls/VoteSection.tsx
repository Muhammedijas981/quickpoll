"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PollOption } from "@/types/poll";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface VoteSectionProps {
  pollId: string;
  options: PollOption[];
  onVote: (pollId: string, optionId: string) => Promise<void>;
}

export function VoteSection({ pollId, options, onVote }: VoteSectionProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleVote = async () => {
    if (!selectedOption || isLoading) return;

    setIsLoading(true);
    try {
      await onVote(pollId, selectedOption);
      setHasVoted(true);
    } catch (error) {
      console.error("Failed to vote:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {options.map((option) => (
          <Card
            key={option.id}
            className={cn(
              "cursor-pointer transition-all",
              selectedOption === option.id && "ring-2 ring-primary",
              hasVoted && "cursor-default"
            )}
            onClick={() => !hasVoted && setSelectedOption(option.id)}
          >
            <CardContent className="p-4 flex items-center justify-between">
              <span className="font-medium">{option.text}</span>
              {selectedOption === option.id && !hasVoted && (
                <Check className="w-5 h-5 text-primary" />
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {!hasVoted && (
        <Button
          onClick={handleVote}
          disabled={!selectedOption || isLoading}
          className="w-full"
        >
          {isLoading ? "Submitting..." : "Submit Vote"}
        </Button>
      )}
    </div>
  );
}
