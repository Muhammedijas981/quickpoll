"use client";

import { useEffect, useRef, useCallback } from "react";
import { WS_URL } from "@/config/constants";
import { usePollStore } from "@/store/pollStore";
import { WebSocketMessage } from "@/types/poll";

export function useWebSocket() {
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();
  const { updatePollVotes, updatePollLikes, addPoll } = usePollStore();

  const connect = useCallback(() => {
    try {
      const ws = new WebSocket(WS_URL);

      ws.onopen = () => {
        console.log("WebSocket connected");
      };

      ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);

          switch (message.type) {
            case "vote":
              updatePollVotes(message.data.pollId, message.data.optionId);
              break;
            case "like":
              updatePollLikes(message.data.pollId);
              break;
            case "new_poll":
              addPoll(message.data.poll);
              break;
          }
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
        }
      };

      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
      };

      ws.onclose = () => {
        console.log("WebSocket disconnected. Reconnecting...");
        reconnectTimeoutRef.current = setTimeout(() => {
          connect();
        }, 3000);
      };

      wsRef.current = ws;
    } catch (error) {
      console.error("Error connecting to WebSocket:", error);
    }
  }, [updatePollVotes, updatePollLikes, addPoll]);

  useEffect(() => {
    connect();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [connect]);

  return wsRef.current;
}
