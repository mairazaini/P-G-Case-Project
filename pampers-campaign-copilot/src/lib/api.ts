// API base URL - adjust if needed for production
const API_BASE_URL = "http://localhost:4000";

/**
 * Check if the backend server is running
 */
export const checkBackendHealth = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/health`, {
      method: "GET",
    });
    return response.ok;
  } catch {
    return false;
  }
};

// Types for API responses
export interface ChatResponse {
  spec: {
    campaign_name: string;
    campaign_type: "promotional" | "non-promotional";
    markets: string[];
    languages: string[];
    duration: string;
    targeting: {
      days_since_app_opened?: string;
      referrals_count?: string;
    };
    promo?: {
      reward_per_referral: number;
      max_reward: number;
      currency: string;
    };
    channels: string[];
    reentry_criteria_days: number;
    exit_criteria: string[];
    use_braze_ai: {
      [key: string]: boolean;
    };
  };
  journey: {
    name: string;
    steps: Array<{
      id: string;
      day: number;
      channel: "push" | "inbox" | "slide_up" | "email";
      conditions?: string[];
      expiry_days?: number;
      message_key: string;
    }>;
  };
  messages: {
    [lang: string]: {
      [messageKey: string]: {
        title?: string;
        body: string;
        subject?: string;
        link_target?: string;
      };
    };
  };
  qa: {
    passed: boolean;
    issues: Array<{
      type: "error" | "warning";
      message: string;
    }>;
    warnings: Array<{
      type: "error" | "warning";
      message: string;
    }>;
  };
}

export interface GoLiveRequest {
  spec: ChatResponse["spec"];
  journey: ChatResponse["journey"];
  messages: ChatResponse["messages"];
  qa: ChatResponse["qa"];
}

export interface GoLiveResponse {
  status: "ok" | "simulated" | "error";
  brazeCampaignId: string;
  brazeRaw: unknown;
  message: string;
}

export interface HypercareResponse {
  campaignId: string;
  stats: {
    sends: number;
    opens: number;
    clicks: number;
    referrals: number;
    optOuts: number;
  };
  aiInsights: string[];
}

/**
 * Send a campaign brief to the AI copilot and get back a complete campaign spec,
 * journey blueprint, messages, and QA report.
 */
export const chatWithCopilot = async (message: string): Promise<ChatResponse> => {
  try {
    console.log("📤 Sending request to:", `${API_BASE_URL}/api/chat`);
    const response = await fetch(`${API_BASE_URL}/api/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message }),
    });

    console.log("📥 Response status:", response.status, response.statusText);

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: "Unknown error" }));
      console.error("❌ API Error:", error);
      throw new Error(error.error || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("✅ Received data:", data);
    return data;
  } catch (err) {
    console.error("❌ Network/Request Error:", err);
    if (err instanceof TypeError && err.message.includes("fetch")) {
      throw new Error(`Cannot connect to backend at ${API_BASE_URL}. Is the server running?`);
    }
    throw err;
  }
};

/**
 * Launch a campaign by sending the spec, journey, messages, and QA report to Braze.
 */
export const goLive = async (data: GoLiveRequest): Promise<GoLiveResponse> => {
  const response = await fetch(`${API_BASE_URL}/api/go-live`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Unknown error" }));
    throw new Error(error.error || error.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};

/**
 * Fetch hypercare metrics and AI insights for a live campaign.
 */
export const fetchHypercare = async (campaignId: string): Promise<HypercareResponse> => {
  const response = await fetch(`${API_BASE_URL}/api/hypercare/${campaignId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Unknown error" }));
    throw new Error(error.error || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};

