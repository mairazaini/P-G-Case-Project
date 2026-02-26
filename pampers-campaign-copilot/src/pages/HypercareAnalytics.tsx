import { useState, useEffect } from "react";
import { Sidebar } from "@/components/Sidebar";
import { getActiveCampaigns, initializeMockData, type SavedCampaign } from "@/lib/campaignStorage";
import { fetchHypercare } from "@/lib/api";
import { getFriendlyCampaignName } from "@/lib/campaignNames";
import { RefreshCw, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { HypercareResponse } from "@/lib/api";

const HypercareAnalytics = () => {
  const [campaigns, setCampaigns] = useState<SavedCampaign[]>([]);
  const [hypercareData, setHypercareData] = useState<{ [campaignId: string]: HypercareResponse }>({});
  const [loading, setLoading] = useState<{ [campaignId: string]: boolean }>({});

  useEffect(() => {
    initializeMockData();
    setCampaigns(getActiveCampaigns());
  }, []);

  const handleRefresh = async (campaignId: string) => {
    setLoading(prev => ({ ...prev, [campaignId]: true }));
    try {
      const data = await fetchHypercare(campaignId);
      setHypercareData(prev => ({ ...prev, [campaignId]: data }));
    } catch (err) {
      console.error("Failed to fetch hypercare:", err);
    } finally {
      setLoading(prev => ({ ...prev, [campaignId]: false }));
    }
  };

  const calculateRate = (numerator: number, denominator: number): number | null => {
    return denominator > 0 ? Math.round((numerator / denominator) * 100) : null;
  };

  return (
    <div className="flex min-h-screen w-full bg-background">
      <Sidebar />
      
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Hypercare Analytics</h1>
              <p className="text-muted-foreground">
                {campaigns.length === 0 
                  ? "Campaign performance analytics and insights will appear here."
                  : `Performance metrics for ${campaigns.length} active campaign${campaigns.length > 1 ? "s" : ""}`}
              </p>
            </div>
          </div>

          {campaigns.length === 0 ? (
            <div className="bg-card rounded-xl border border-border p-12 text-center">
              <p className="text-muted-foreground">No active campaigns yet.</p>
              <p className="text-sm text-muted-foreground mt-2">
                Launch a campaign to see performance analytics here.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {campaigns.map((campaign) => {
                const data = hypercareData[campaign.goLiveResult?.brazeCampaignId || ""];
                const stats = data?.stats || {
                  sends: 0,
                  opens: 0,
                  clicks: 0,
                  referrals: 0,
                  optOuts: 0,
                };

                const openRate = calculateRate(stats.opens, stats.sends);
                const clickRate = calculateRate(stats.clicks, stats.opens);
                const referralRate = calculateRate(stats.referrals, stats.clicks);
                const optOutRate = stats.sends > 0 ? ((stats.optOuts / stats.sends) * 100).toFixed(2) : "0.00";

                const isLoading = loading[campaign.goLiveResult?.brazeCampaignId || ""];

                return (
                  <div key={campaign.id} className="bg-card rounded-xl border border-border p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h2 className="text-xl font-semibold text-foreground mb-1">
                          {getFriendlyCampaignName(campaign.spec.campaign_name)}
                        </h2>
                        <p className="text-sm text-muted-foreground">
                          {campaign.goLiveResult?.brazeCampaignId || "No campaign ID"}
                        </p>
                      </div>
                      <Button
                        onClick={() => handleRefresh(campaign.goLiveResult?.brazeCampaignId || "")}
                        disabled={!campaign.goLiveResult || isLoading}
                        variant="outline"
                        size="sm"
                      >
                        <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
                        {isLoading ? "Loading..." : "Refresh"}
                      </Button>
                    </div>

                    {/* Metrics Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                      <div className="bg-background p-4 rounded-xl border border-border">
                        <p className="text-xs text-muted-foreground mb-1">Sends</p>
                        <p className="text-2xl font-bold text-foreground">{stats.sends.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground mt-1">Total messages</p>
                      </div>
                      <div className="bg-background p-4 rounded-xl border border-border">
                        <p className="text-xs text-muted-foreground mb-1">Opens</p>
                        <p className="text-2xl font-bold text-foreground">{stats.opens.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {openRate !== null ? `${openRate}% open rate` : "No sends yet"}
                        </p>
                      </div>
                      <div className="bg-background p-4 rounded-xl border border-border">
                        <p className="text-xs text-muted-foreground mb-1">Clicks</p>
                        <p className="text-2xl font-bold text-foreground">{stats.clicks.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {clickRate !== null ? `${clickRate}% CTR` : "No opens yet"}
                        </p>
                      </div>
                      <div className="bg-background p-4 rounded-xl border border-border">
                        <p className="text-xs text-muted-foreground mb-1">Referrals</p>
                        <p className="text-2xl font-bold text-foreground">{stats.referrals.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {referralRate !== null ? `${referralRate}% conversion` : "No clicks yet"}
                        </p>
                      </div>
                      <div className="bg-background p-4 rounded-xl border border-border">
                        <p className="text-xs text-muted-foreground mb-1">Opt-outs</p>
                        <p className="text-2xl font-bold text-foreground">{stats.optOuts.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground mt-1">{optOutRate}% opt-out rate</p>
                      </div>
                    </div>

                    {/* AI Insights */}
                    {data?.aiInsights && data.aiInsights.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                          <Lightbulb className="w-5 h-5 text-pampers-yellow" />
                          AI Insights
                        </h3>
                        <div className="space-y-3">
                          {data.aiInsights.map((insight, index) => (
                            <div key={index} className="bg-pampers-yellow/10 p-4 rounded-xl border border-pampers-yellow/20">
                              <p className="text-sm text-foreground">{insight}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default HypercareAnalytics;
