import { describe, expect, it, vi, beforeEach } from "vitest";
import { saveTabData } from "./github";
import type { TabData } from "../types";

const mockGetContent = vi.fn();
const mockCreateOrUpdate = vi.fn();

vi.mock("@octokit/rest", () => {
  return {
    Octokit: class {
      rest = {
        repos: {
          getContent: (...args: unknown[]) => mockGetContent(...args),
          createOrUpdateFileContents: (...args: unknown[]) => mockCreateOrUpdate(...args),
        },
      };
    },
  };
});

const data: TabData = {
  key: "ai",
  name: "AI工具",
  hasCategoryFilter: true,
  hasSideMenu: true,
  showCategoryBadge: true,
  categories: ["AI工具"],
  tools: [],
};

describe("saveTabData", () => {
  beforeEach(() => {
    mockGetContent.mockReset();
    mockCreateOrUpdate.mockReset();
  });

  it("fetches current SHA then commits new content", async () => {
    mockGetContent.mockResolvedValue({ data: { sha: "abc123" } });
    mockCreateOrUpdate.mockResolvedValue({ data: { commit: { sha: "newsha" } } });

    const res = await saveTabData(
      { token: "t", owner: "o", repo: "r" },
      "ai",
      data
    );

    expect(mockGetContent).toHaveBeenCalledWith({ owner: "o", repo: "r", path: "public/data/ai.json" });
    expect(mockCreateOrUpdate).toHaveBeenCalledWith(
      expect.objectContaining({ owner: "o", repo: "r", path: "public/data/ai.json", sha: "abc123" })
    );
    expect(res.commitSha).toBe("newsha");
  });

  it("works when file does not exist yet (404)", async () => {
    mockGetContent.mockRejectedValue({ status: 404 });
    mockCreateOrUpdate.mockResolvedValue({ data: { commit: { sha: "firstsha" } } });

    const res = await saveTabData({ token: "t", owner: "o", repo: "r" }, "ai", data);
    expect(mockCreateOrUpdate).toHaveBeenCalledWith(
      expect.not.objectContaining({ sha: expect.anything() })
    );
    expect(res.commitSha).toBe("firstsha");
  });
});
