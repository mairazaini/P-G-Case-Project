import { CampaignSpec, JourneyBlueprint, JourneyStep } from "./types";

export const buildJourneyFromSpec = async (
  spec: CampaignSpec
): Promise<JourneyBlueprint> => {
  // Check if this is a RAF/promotional campaign
  const isRAF = spec.campaign_name.startsWith("RAF_") || spec.campaign_type === "promotional";

  if (isRAF) {
    // Build RAF always-on journey
    const steps: JourneyStep[] = [
      // Day 1
      {
        id: "day1_push",
        day: 1,
        channel: "push",
        conditions: ["referrals < 5", "push_opt_in"],
        expiry_days: 15,
        message_key: "raf_day1_push",
      },
      {
        id: "day1_inbox",
        day: 1,
        channel: "inbox",
        conditions: ["referrals < 5", "push_opt_out"],
        expiry_days: 15,
        message_key: "raf_day1_inbox",
      },
      // Day 14
      {
        id: "day14_push",
        day: 14,
        channel: "push",
        conditions: ["referrals < 5", "push_opt_in"],
        expiry_days: 15,
        message_key: "raf_day14_push",
      },
      {
        id: "day14_slideup",
        day: 14,
        channel: "slide_up",
        conditions: ["referrals < 5", "push_opt_out"],
        expiry_days: 15,
        message_key: "raf_day14_slideup",
      },
      {
        id: "day14_email",
        day: 14,
        channel: "email",
        conditions: ["referrals < 5", "push_opt_out"],
        expiry_days: 15,
        message_key: "raf_day14_email",
      },
      // Day 30
      {
        id: "day30_push",
        day: 30,
        channel: "push",
        conditions: ["referrals < 5", "push_opt_in"],
        expiry_days: 15,
        message_key: "raf_day30_push",
      },
      {
        id: "day30_slideup",
        day: 30,
        channel: "slide_up",
        conditions: ["referrals < 5", "push_opt_out"],
        expiry_days: 15,
        message_key: "raf_day30_slideup",
      },
      {
        id: "day30_inbox",
        day: 30,
        channel: "inbox",
        conditions: ["referrals < 5", "push_opt_out"],
        expiry_days: 15,
        message_key: "raf_day30_inbox",
      },
    ];

    return {
      name: `${spec.campaign_name}_journey`,
      steps,
    };
  }

  // Default simple one-step journey for non-promotional campaigns
  return {
    name: `${spec.campaign_name}_journey`,
    steps: [
      {
        id: "day1_push",
        day: 1,
        channel: "push",
        conditions: [],
        message_key: "generic_day1_push",
      },
    ],
  };
};

