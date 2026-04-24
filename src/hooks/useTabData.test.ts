import { renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useTabData } from "./useTabData";

const mockData = {
  name: "AI工具",
  hasCategoryFilter: true,
  hasSideMenu: true,
  showCategoryBadge: true,
  categories: ["AI工具", "AI图像"],
  tools: [
    { id: "a-0", name: "A", description: "desc", category: "AI工具", url: "https://a.com", iconType: "text", iconText: "A", iconBg: "x" },
  ],
};

describe("useTabData", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockData,
      }) as unknown as typeof fetch
    );
  });
  afterEach(() => vi.unstubAllGlobals());

  it("fetches /data/<key>.json and returns parsed TabData", async () => {
    const { result } = renderHook(() => useTabData("ai"));
    await waitFor(() => expect(result.current.data).not.toBeNull());
    expect(result.current.data?.categories).toEqual(["AI工具", "AI图像"]);
    expect(result.current.data?.tools).toHaveLength(1);
    expect(fetch).toHaveBeenCalledWith("/data/ai.json");
  });

  it("exposes loading state", async () => {
    const { result } = renderHook(() => useTabData("ai"));
    expect(result.current.loading).toBe(true);
    await waitFor(() => expect(result.current.loading).toBe(false));
  });
});
