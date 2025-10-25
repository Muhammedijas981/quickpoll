import { create } from "zustand";
import { Poll } from "@/types/poll";

interface PollStore {
  polls: Poll[];
  currentPoll: Poll | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  setPolls: (polls: Poll[]) => void;
  addPoll: (poll: Poll) => void;
  updatePoll: (pollId: string, updates: Partial<Poll>) => void;
  setCurrentPoll: (poll: Poll | null) => void;
  updatePollVotes: (pollId: string, optionId: string) => void;
  updatePollLikes: (pollId: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const usePollStore = create<PollStore>((set) => ({
  polls: [],
  currentPoll: null,
  isLoading: false,
  error: null,

  setPolls: (polls) => set({ polls }),

  addPoll: (poll) =>
    set((state) => ({
      polls: [poll, ...state.polls],
    })),

  updatePoll: (pollId, updates) =>
    set((state) => ({
      polls: state.polls.map((poll) =>
        poll.id === pollId ? { ...poll, ...updates } : poll
      ),
      currentPoll:
        state.currentPoll?.id === pollId
          ? { ...state.currentPoll, ...updates }
          : state.currentPoll,
    })),

  setCurrentPoll: (poll) => set({ currentPoll: poll }),

  updatePollVotes: (pollId, optionId) =>
    set((state) => ({
      polls: state.polls.map((poll) => {
        if (poll.id === pollId) {
          return {
            ...poll,
            options: poll.options.map((option) =>
              option.id === optionId
                ? { ...option, votes: option.votes + 1 }
                : option
            ),
            totalVotes: poll.totalVotes + 1,
          };
        }
        return poll;
      }),
    })),

  updatePollLikes: (pollId) =>
    set((state) => ({
      polls: state.polls.map((poll) =>
        poll.id === pollId ? { ...poll, likes: poll.likes + 1 } : poll
      ),
    })),

  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
}));
