import { create } from "zustand";
import { Poll } from "@/types/poll";

interface PollStore {
  polls: Poll[];
  currentPoll: Poll | null;
  isLoading: boolean;
  error: string | null;

  setPolls: (polls: Poll[]) => void;
  addPoll: (poll: Poll) => void;
  updatePoll: (pollId: string, updates: Partial<Poll>) => void;
  setCurrentPoll: (poll: Poll | null) => void;
  updatePollVotes: (pollId: string, optionId: string) => void;
  updatePollLikes: (pollId: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const usePollStore = create<PollStore>((set, get) => ({
  polls: [],
  currentPoll: null,
  isLoading: false,
  error: null,

  setPolls: (polls) => {
    console.log("📊 Setting polls:", polls.length);
    set({ polls });
  },

  addPoll: (poll) => {
    console.log("➕ Adding new poll:", poll.title);

    // Check if poll already exists
    const exists = get().polls.some((p) => p.id === poll.id);
    if (exists) {
      console.log("⚠️ Poll already exists, skipping add");
      return;
    }

    set((state) => ({
      polls: [poll, ...state.polls],
    }));
  },

  updatePoll: (pollId, updates) => {
    console.log("🔄 Updating poll:", pollId);
    set((state) => ({
      polls: state.polls.map((poll) =>
        poll.id === pollId ? { ...poll, ...updates } : poll
      ),
      currentPoll:
        state.currentPoll?.id === pollId
          ? { ...state.currentPoll, ...updates }
          : state.currentPoll,
    }));
  },

  setCurrentPoll: (poll) => {
    console.log("👁️ Setting current poll:", poll?.id);
    set({ currentPoll: poll });
  },

  updatePollVotes: (pollId, optionId) => {
    console.log("🗳️ Vote update for poll:", pollId, "option:", optionId);

    set((state) => {
      // Find the poll
      const pollExists = state.polls.some((p) => p.id === pollId);
      if (!pollExists) {
        console.log("⚠️ Poll not found in store, skipping update");
        return state;
      }

      // Update in polls list
      const updatedPolls = state.polls.map((poll) => {
        if (poll.id === pollId) {
          const updatedOptions = poll.options.map((option) =>
            option.id === optionId
              ? { ...option, votes: option.votes + 1 }
              : option
          );
          return {
            ...poll,
            options: updatedOptions,
            totalVotes: poll.totalVotes + 1,
          };
        }
        return poll;
      });

      // Update current poll if it matches
      let updatedCurrentPoll = state.currentPoll;
      if (state.currentPoll?.id === pollId) {
        const updatedOptions = state.currentPoll.options.map((option) =>
          option.id === optionId
            ? { ...option, votes: option.votes + 1 }
            : option
        );
        updatedCurrentPoll = {
          ...state.currentPoll,
          options: updatedOptions,
          totalVotes: state.currentPoll.totalVotes + 1,
        };
      }

      return {
        polls: updatedPolls,
        currentPoll: updatedCurrentPoll,
      };
    });
  },

  updatePollLikes: (pollId) => {
    console.log("❤️ Like update for poll:", pollId);

    set((state) => {
      // Find the poll
      const pollExists = state.polls.some((p) => p.id === pollId);
      if (!pollExists) {
        console.log("⚠️ Poll not found in store, skipping update");
        return state;
      }

      // Update in polls list
      const updatedPolls = state.polls.map((poll) =>
        poll.id === pollId ? { ...poll, likes: poll.likes + 1 } : poll
      );

      // Update current poll if it matches
      let updatedCurrentPoll = state.currentPoll;
      if (state.currentPoll?.id === pollId) {
        updatedCurrentPoll = {
          ...state.currentPoll,
          likes: state.currentPoll.likes + 1,
        };
      }

      return {
        polls: updatedPolls,
        currentPoll: updatedCurrentPoll,
      };
    });
  },

  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
}));
