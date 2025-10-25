"use client";

import { useEffect } from "react";
import { usePollStore } from "@/store/pollStore";
import { pollsApi } from "@/lib/api";
import { PollCard } from "./PollCard";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { ErrorMessage } from "@/components/common/ErrorMessage";

export function PollList() {
  const { polls, isLoading, error, setPolls, setLoading, setError } =
    usePollStore();

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

  // Deduplicate polls by ID (just in case)
  const uniquePolls = Array.from(
    new Map(polls.map((poll) => [poll.id, poll])).values()
  );

  if (uniquePolls.length === 0) {
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
      {uniquePolls.map((poll) => (
        <PollCard key={poll.id} poll={poll} />
      ))}
    </div>
  );
}
