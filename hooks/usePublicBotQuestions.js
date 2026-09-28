"use client";

import { useQuery } from "@tanstack/react-query";
import { publicBotQuestionService } from "@/services/public-bot-question.service";

async function loadAllBotQuestions() {
  const collected = [];
  let page = 1;
  let lastPage = 1;

  do {
    const response = await publicBotQuestionService.getBotQuestions({
      page,
      per_page: 100,
    });
    const payload = response?.data || {};
    const rows = Array.isArray(payload.data) ? payload.data : [];
    collected.push(...rows);
    lastPage = Number(payload.last_page) || 1;
    page += 1;
  } while (page <= lastPage);

  return collected;
}

/**
 * Loads the public bot question list when the chat is opened.
 * Follows GET /bot-questions and appends further pages when last_page > 1.
 */
export function usePublicBotQuestions(enabled = false) {
  return useQuery({
    queryKey: ["public-bot-questions"],
    queryFn: loadAllBotQuestions,
    enabled,
    staleTime: 1000 * 60 * 10,
  });
}
