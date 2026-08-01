import { describe, it, expect, beforeEach, vi } from "vitest";

describe("config", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it("getConfig throws if called before loadConfig", async () => {
    const { getConfig } = await import("./config.js");
    expect(() => getConfig()).toThrow("Config not loaded");
  });

  it("loadConfig returns defaults when no config file exists", async () => {
    const origHome = process.env.HOME;
    process.env.HOME = "/tmp/barry-test-no-config";
    try {
      const { loadConfig } = await import("./config.js");
      const config = await loadConfig();
      expect(config).toHaveProperty("defaultVoice");
      expect(config).toHaveProperty("piperPath");
      expect(config).toHaveProperty("modelsDir");
      expect(config.defaultVoiceModeEnabled).toBe(false);
    } finally {
      process.env.HOME = origHome;
    }
  });

  it("getConfig returns cached value after loadConfig", async () => {
    const origHome = process.env.HOME;
    process.env.HOME = "/tmp/barry-test-no-config";
    try {
      const { loadConfig, getConfig } = await import("./config.js");
      await loadConfig();
      const config = getConfig();
      expect(config).toHaveProperty("defaultVoice");
    } finally {
      process.env.HOME = origHome;
    }
  });
});
