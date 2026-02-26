import { Sparkles, FileText, Activity, BarChart3 } from "lucide-react";
import { NavLink } from "./NavLink";

const navItems = [
  { id: "new", label: "New Campaign", icon: Sparkles, path: "/" },
  { id: "drafts", label: "Drafts", icon: FileText, path: "/drafts" },
  { id: "active", label: "Active Campaigns", icon: Activity, path: "/active-campaigns" },
  { id: "analytics", label: "Hypercare Analytics", icon: BarChart3, path: "/hypercare-analytics" },
];

export const Sidebar = () => {
  return (
    <div className="w-60 bg-card border-r border-border h-screen sticky top-0 flex flex-col">
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-foreground">Pampers</h1>
            <p className="text-xs text-muted-foreground">Campaign Copilot</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.id}>
                <NavLink
                  to={item.path}
                  end
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors text-foreground hover:bg-muted"
                  activeClassName="bg-primary text-primary-foreground hover:bg-primary"
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-border">
        <div className="text-xs text-muted-foreground">
          <p>Powered by AI</p>
          <p className="mt-1">v1.0.0</p>
        </div>
      </div>
    </div>
  );
};
