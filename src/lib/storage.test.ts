import { beforeEach, describe, expect, it } from "vitest";
import { loadAdminConfig, saveAdminConfig, clearAdminConfig } from "./storage";

describe("admin config storage", () => {
  beforeEach(() => localStorage.clear());

  it("returns null when nothing saved", () => {
    expect(loadAdminConfig()).toBeNull();
  });

  it("round-trips a saved config", () => {
    saveAdminConfig({ token: "tok", owner: "lsf0511", repo: "fanli-tools" });
    expect(loadAdminConfig()).toEqual({ token: "tok", owner: "lsf0511", repo: "fanli-tools" });
  });

  it("clears saved config", () => {
    saveAdminConfig({ token: "tok", owner: "o", repo: "r" });
    clearAdminConfig();
    expect(loadAdminConfig()).toBeNull();
  });
});
