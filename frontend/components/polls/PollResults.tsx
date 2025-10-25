"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { PollOption } from "@/types/poll";
import { calculatePercentage } from "@/lib/utils";

interface PollResultsProps {
  options: PollOption[];
  totalVotes: number;
}

export function PollResults({ options, totalVotes }: PollResultsProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Results</h3>
        <Badge variant="secondary">{totalVotes} votes</Badge>
      </div>

      <div className="space-y-3">
        {options.map((option) => {
          const percentage = calculatePercentage(option.votes, totalVotes);

          return (
            <Card key={option.id}>
              <CardContent className="p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{option.text}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      {option.votes} votes
                    </span>
                    <Badge>{percentage}%</Badge>
                  </div>
                </div>
                <Progress value={percentage} className="h-2" />
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
