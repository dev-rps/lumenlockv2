"use client";

import { useQuery } from "@tanstack/react-query";
import { EventService } from "@/app/services/events";

export function useContractEvents() {
  return useQuery({
    queryKey: ["events"],
    queryFn: () => EventService.getRecentEvents(50),
    refetchInterval: 4000, // 4-second real-time polling
  });
}
