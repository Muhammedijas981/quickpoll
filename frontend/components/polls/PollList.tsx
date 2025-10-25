"use client";

import { useEffect } from "react";
import { usePollStore } from "@/store/pollStore";
import { pollsApi } from "@/lib/api";
import { PollCard } from "./PollCard";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { ErrorMessage } from "@/components/common/ErrorMessage";
import { useWebSocket } from "@/hooks/useWebSocket";

export function PollList() {
  const { polls, isLoading, error, setPolls, setLoading, setError } =
    usePollStore();

  // Connect to WebSocket for real-time updates
  useWebSocket();

  useEffect(() => {
    const fetchPolls = async () => {
      setLoading(true);
      try {
        const data = await pollsApi.getPolls();
        setPolls(data);
        setError(null);
      } catch (err: any) {
        setError(err.message || "Failed to fetch polls");
      } finally {
        setLoading(false);
      }
    };

    fetchPolls();
  }, [setPolls, setLoading, setError]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (polls.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">
          No polls yet. Be the first to create one!
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {polls.map((poll) => (
        <PollCard key={poll.id} poll={poll} />
      ))}
    </div>
  );
}
