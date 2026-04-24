import { renderHook, act } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useFilter } from "./useFilter";
import type { Tool } from "../types";

const tools: Tool[] = [
  { id: "1", name: "ChatGPT", description: "AI对话工具", category: "AI工具", url: "", iconType: "text" },
  { id: "2", name: "Midjourney", description: "AI图像生成", category: "AI图像", url: "", iconType: "text" },
  { id: "3", name: "Claude", description: "长文本AI助手", category: "AI工具", url: "", iconType: "text" },
];

describe("useFilter", () => {
  it("returns all tools when no filters", () => {
    const { result } = renderHook(() => useFilter(tools));
    expect(result.current.filtered).toHaveLength(3);
  });

  it("filters by category", () => {
    const { result } = renderHook(() => useFilter(tools));
    act(() => result.current.setCategory("AI工具"));
    expect(result.current.filtered.map((t) => t.name)).toEqual(["ChatGPT", "Claude"]);
  });

  it("filters by search across name, description, and category (case-insensitive)", () => {
    const { result } = renderHook(() => useFilter(tools));
    act(() => result.current.setQuery("图像"));
    expect(result.current.filtered.map((t) => t.name)).toEqual(["Midjourney"]);

    act(() => result.current.setQuery("gpt"));
    expect(result.current.filtered.map((t) => t.name)).toEqual(["ChatGPT"]);
  });

  it("combines category and search", () => {
    const { result } = renderHook(() => useFilter(tools));
    act(() => result.current.setCategory("AI工具"));
    act(() => result.current.setQuery("claude"));
    expect(result.current.filtered.map((t) => t.name)).toEqual(["Claude"]);
  });
});
