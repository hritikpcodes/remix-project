export type MatchType = "exact" | "phrase" | "broad";
export type KeywordState = "enabled" | "disabled";

export interface Keyword {
  id: number;
  campaignId: number;
  text: string;
  bid: number;
  match_type: MatchType;
  state: KeywordState;
}

export interface AdCampaign {
  id: number;
  name: string;
  daily_budget: number;
  keywords: Keyword[];
}

// Mock Campaign Data
export const campaigns: AdCampaign[] = [
  {
    id: 1,
    name: "Summer Deals",
    daily_budget: 150.0,
    keywords: [
      {
        id: 101,
        campaignId: 1,
        text: "summer sale",
        bid: 1.2,
        match_type: "phrase",
        state: "enabled",
      },
      {
        id: 102,
        campaignId: 1,
        text: "beach vacation",
        bid: 0.9,
        match_type: "broad",
        state: "enabled",
      },
    ],
  },
  {
    id: 2,
    name: "Winter Warmers",
    daily_budget: 200.0,
    keywords: [
      {
        id: 201,
        campaignId: 2,
        text: "winter jacket",
        bid: 2.1,
        match_type: "exact",
        state: "enabled",
      },
      {
        id: 202,
        campaignId: 2,
        text: "thermal wear",
        bid: 1.5,
        match_type: "phrase",
        state: "disabled",
      },
    ],
  },
  {
    id: 3,
    name: "Back to School",
    daily_budget: 100.0,
    keywords: [
      {
        id: 301,
        campaignId: 3,
        text: "school supplies",
        bid: 1.0,
        match_type: "broad",
        state: "enabled",
      },
      {
        id: 302,
        campaignId: 3,
        text: "notebooks",
        bid: 0.8,
        match_type: "exact",
        state: "enabled",
      },
    ],
  },
  {
    id: 4,
    name: "Flash Friday",
    daily_budget: 300.0,
    keywords: [
      {
        id: 401,
        campaignId: 4,
        text: "flash sale",
        bid: 3.0,
        match_type: "phrase",
        state: "enabled",
      },
    ],
  },
];



export const addCampaign = (campaign: AdCampaign) => {
  if (campaign) {
    campaigns.push(campaign);
  }
};
