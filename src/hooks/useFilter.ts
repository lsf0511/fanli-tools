import { useMemo, useState } from "react";
import type { Tool } from "../types";

export interface UseFilterResult {
  query: string;
  setQuery: (q: string) => void;
  category: string | null;
  setCategory: (c: string | null) => void;
  filtered: Tool[];
}

export function useFilter(tools: Tool[]): UseFilterResult {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return tools.filter((t) => {
      if (category && t.category !== category) return false;
      if (!q) return true;
      return (
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        (t.category ?? "").toLowerCase().includes(q)
      );
    });
  }, [tools, query, category]);

  return { query, setQuery, category, setCategory, filtered };
}
