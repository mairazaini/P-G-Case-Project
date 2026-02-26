// TypeScript interfaces for the Campaign Copilot

export interface CampaignSpec {
  name: string;
  type: string;
  objective: string;
  markets: string[];
  duration: string;
  channels: string[];
  brazeAI: string[];
}

export interface JourneyStep {
  day: number;
  channels: string[];
  description: string;
}

export interface LocalizedMessage {
  market: string;
  language: string;
  pushCopy: string;
  emailSubject: string;
}

export interface LocalizedCopy {
  messages: LocalizedMessage[];
}

export interface QAIssue {
  severity: "Low" | "Medium" | "High";
  description: string;
  suggestedFix: string;
}

export interface QAReport {
  status: "Pass" | "Pass with warnings" | "Fail";
  issues: QAIssue[];
}

export interface HypercareMetric {
  label: string;
  value: string;
  change: string;
}

export interface HypercareMetrics {
  metrics: HypercareMetric[];
  insights: string[];
}

export interface ChatMessage {
  role: "user" | "copilot";
  content: string;
  timestamp: Date;
}

// Mock data objects

export const mockSpec: CampaignSpec = {
  name: "XMAS_2025_Pampers_Referral",
  type: "Promotional",
  objective: "Christmas Scan Challenge",
  markets: ["US", "DE", "ES"],
  duration: "December 1-25 (Always-on)",
  channels: ["Push", "Inbox", "Email"],
  brazeAI: ["Intelligent Timing", "Intelligent Channel", "Variant Optimization"],
};

export const mockJourney: JourneyStep[] = [
  {
    day: 1,
    channels: ["Push", "Inbox"],
    description: "Welcome message with Christmas offer",
  },
  {
    day: 7,
    channels: ["Push"],
    description: "Reminder to scan and earn",
  },
  {
    day: 14,
    channels: ["Email"],
    description: "Festive recap and bonus opportunity",
  },
];

export const mockCopy: LocalizedCopy = {
  messages: [
    {
      market: "US",
      language: "English",
      pushCopy: "🎄 Scan and earn Pampers Cash this Christmas!",
      emailSubject: "Your festive rewards are waiting!",
    },
    {
      market: "DE",
      language: "Deutsch",
      pushCopy: "🎄 Scanne und verdiene Pampers Cash zu Weihnachten!",
      emailSubject: "Deine festlichen Belohnungen warten auf dich!",
    },
    {
      market: "ES",
      language: "Español",
      pushCopy: "🎄 Escanea y gana Pampers Cash esta Navidad!",
      emailSubject: "¡Tus recompensas festivas te esperan!",
    },
  ],
};

export const mockQa: QAReport = {
  status: "Pass with warnings",
  issues: [
    {
      severity: "Medium",
      description: "Target segment overlaps 65% with 'US_Winback_Oct' campaign.",
      suggestedFix: "Exclude users in US_Winback_Oct or delay start by 7 days.",
    },
    {
      severity: "Low",
      description: "DE audience is small (~350 users), optimization might be limited.",
      suggestedFix: "Consider expanding eligibility from 30+ days since join to 14+ days.",
    },
  ],
};

export const mockHypercare: HypercareMetrics = {
  metrics: [
    {
      label: "Opens (last 24h)",
      value: "34%",
      change: "+4%",
    },
    {
      label: "Click-through Rate",
      value: "8%",
      change: "+2%",
    },
    {
      label: "Referrals",
      value: "1,150",
      change: "+12%",
    },
  ],
  insights: [
    "Variant B email subject performs 22% better than Variant A.",
    "DE push underperforms; consider shorter copy.",
    "Users who scanned twice are most likely to refer friends — consider a special tier.",
  ],
};

export const mockInitialMessages: ChatMessage[] = [
  {
    role: "user",
    content: "Create a Christmas-themed campaign for US, DE and ES with Push + Email and festive Pampers Cash rewards.",
    timestamp: new Date(),
  },
  {
    role: "copilot",
    content: "Got it! I'll generate a multi-country Christmas campaign with localized copy, a 30-day journey, and a QA report.",
    timestamp: new Date(),
  },
];
