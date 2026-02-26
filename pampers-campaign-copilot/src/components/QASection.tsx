import { AlertCircle, CheckCircle2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { ChatResponse } from "@/lib/api";

interface QASectionProps {
  qa: ChatResponse["qa"];
}

const getSeverityColor = (type: "error" | "warning") => {
  switch (type) {
    case "error":
      return "bg-destructive/10 text-destructive border-destructive/20";
    case "warning":
      return "bg-warning/10 text-warning border-warning/20";
    default:
      return "bg-muted text-muted-foreground";
  }
};

const getSeverityIcon = (type: "error" | "warning") => {
  switch (type) {
    case "error":
      return <AlertCircle className="w-4 h-4" />;
    case "warning":
      return <AlertTriangle className="w-4 h-4" />;
    default:
      return null;
  }
};

export const QASection = ({ qa }: QASectionProps) => {
  const handleApplyFix = (issueDescription: string) => {
    console.log("Applying fix for:", issueDescription);
  };

  const status = qa.passed ? "Pass" : qa.warnings.length > 0 ? "Pass with warnings" : "Fail";
  const statusColor = qa.passed 
    ? "bg-success/10 text-success border-success/20"
    : "bg-warning/10 text-warning border-warning/20";

  // Combine issues and warnings
  const allIssues = [
    ...qa.issues.map(i => ({ ...i, severity: "error" as const })),
    ...qa.warnings.map(w => ({ ...w, severity: "warning" as const })),
  ];

  return (
    <div className="bg-card rounded-2xl border border-border p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-foreground mb-2">Quality Assurance Report</h2>
          <p className="text-sm text-muted-foreground">
            Automated checks for segments, timing, and compliance.
          </p>
        </div>
        <Badge className={statusColor}>
          {status}
        </Badge>
      </div>

      {allIssues.length === 0 ? (
        <div className="bg-success/10 border border-success/20 rounded-xl p-5">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-success" />
            <p className="text-sm font-medium text-foreground">All checks passed! Campaign is ready to launch.</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {allIssues.map((issue, index) => (
            <div key={index} className="bg-background p-5 rounded-xl border border-border">
              <div className="flex items-start gap-4">
                <Badge className={getSeverityColor(issue.type)}>
                  {getSeverityIcon(issue.type)}
                  <span className="ml-1">{issue.type === "error" ? "Error" : "Warning"}</span>
                </Badge>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground mb-2">{issue.message}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleApplyFix(issue.message)}
                    className="text-xs"
                  >
                    Apply Fix
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
