// backend/server.js
const express = require("express");
const cors = require("cors");
require("dotenv").config();

// Enable importing TypeScript files at runtime
require("ts-node").register({ transpileOnly: true });

// AI orchestrator (Girl 1’s logic)
const { handleChat } = require("./ai/index");

// Braze client (mock or real)
const { createMockCampaignInBraze } = require("./brazeClient");

const app = express();
const PORT = 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

// ==============================
// 1. CHAT ENDPOINT (AI)
// ==============================
app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "message is required" });
    }

    console.log("💬 /api/chat received brief:", message);

    const result = await handleChat(message);
    // result contains: { spec, journey, messages, qa }

    console.log("✨ AI generated campaign:", result?.spec?.campaign_name);

    res.json(result);
  } catch (err) {
    console.error("❌ Error in /api/chat:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ==============================
// 2. GO LIVE ENDPOINT (Braze)
// ==============================
app.post("/api/go-live", async (req, res) => {
  const { spec, journey, messages, qa } = req.body;

  console.log("\n🚀 === GO LIVE REQUEST ===");
  console.log("📘 spec:", spec);
  console.log("🛠 journey:", journey?.steps?.length, "steps");
  console.log("✉️  messages:", Object.keys(messages || {}).length, "languages");
  console.log("🧪 QA passed:", qa?.passed);
  console.log("=========================\n");

  try {
    // Try to send campaign to Braze
    const brazeResult = await createMockCampaignInBraze(spec);

    res.json({
      status: brazeResult.success ? "ok" : "simulated",
      brazeCampaignId: brazeResult.data?.campaign_id || "mock_campaign_001",
      brazeRaw: brazeResult,
      message: brazeResult.success
        ? "Campaign created in Braze (demo)."
        : "Braze call skipped or failed — simulated campaign created.",
    });
  } catch (err) {
    console.error("❌ Error in /api/go-live:", err);
    res.status(500).json({
      status: "error",
      message: "Failed to create campaign",
    });
  }
});

// ==============================
// 3. HYPERCARE (Mock Analytics)
// ==============================
app.get("/api/hypercare/:campaignId", (req, res) => {
  const { campaignId } = req.params;

  console.log("📊 Hypercare requested for:", campaignId);

  const stats = {
    sends: 4200,
    opens: 1450,
    clicks: 350,
    referrals: 78,
    optOuts: 5,
  };

  const aiInsights = [
    "Variant B is performing ~22% better on clicks than Variant A.",
    "DE audience is smaller; consider broadening eligibility.",
    "Day 30 email underperforms; try a shorter, more urgent version.",
  ];

  res.json({
    campaignId,
    stats,
    aiInsights,
  });
});

// ==============================
// Start Server
// ==============================
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`\n🔥 Backend running on http://localhost:${PORT}`);
    console.log("   Health check → /api/health\n");
  });
}

module.exports = app;

// Note: Designed to run efficiently on ARM-based Node.js environments (e.g., AWS Graviton)
// via the node:20-alpine multi-arch Docker image.
