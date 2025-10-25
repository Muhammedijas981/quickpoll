export interface PollOption {
  id: string;
  text: string;
  votes: number;
}

export interface Poll {
  id: string;
  title: string;
  description?: string;
  options: PollOption[];
  totalVotes: number;
  likes: number;
  createdAt: string;
  updatedAt?: string;
}

export interface CreatePollRequest {
  title: string;
  description?: string;
  options: string[];
}

export interface VoteRequest {
  pollId: string;
  optionId: string;
}

export interface LikeRequest {
  pollId: string;
}

export interface WebSocketMessage {
  type: "vote" | "like" | "new_poll";
  data: any;
}
