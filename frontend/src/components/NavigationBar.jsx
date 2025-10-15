import React from "react";
import { Link, useLocation } from "react-router-dom";

// shadcn components (assume ils existent dans src/components/ui/)
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { Home, Server, Settings, LogOut, User, CloudCog, MonitorPlay } from "lucide-react";

// Exemple fallback icons si tu n'as pas icons.js
const DefaultIcon = ({ children }) => (
  <div className="w-5 h-5 flex items-center justify-center">{children}</div>
);

/**
 * items = [
 *  { key: 'dashboard', label: 'Dashboard', to: '/dashboard', icon: <icons.home /> },
 *  { key: 'vms', label: 'Infrastructure', to: '/infra', icon: <icons.server /> },
 *  ...
 * ]
 */
function NavigationBar({ user = null }) {
  const items = [
    {
      key: "dashboard",
      label: "Dashboard",
      to: "/",
      icon: <Home className="w-5 h-5" />,
    },
    {
      key: "infra",
      label: "Infrastructure",
      to: "/infrastructure-view",
      icon: <CloudCog className="w-5 h-5" />,
    },
    {
      key: "deploy-vm",
      label: "Deploy VM",
      to: "/vm/create",
      icon: <Server className="w-5 h-5" />,
    },
  ];
  const location = useLocation();

  return (
    <aside className="h-full w-64 bg-surface border-r border-slate-200 dark:border-slate-800 flex flex-col bg-gray-50">
      {/* Top area: logo / title */}
      <div className="px-4 py-4 flex items-center gap-3">
        <div className="flex items-center gap-2">
          <Link to="/">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center text-white font-bold">
              <MonitorPlay />
            </div>
          </Link>
          <div className="flex flex-col">
            <Link to="/">
              <div className="text-sm font-semibold">Crossland</div>
              <div className="text-xs text-muted-foreground">
                Infrastructure
              </div>
            </Link>
          </div>
        </div>
      </div>

      <Separator />

      {/* Scrollable nav list */}
      <ScrollArea className="flex-1 px-2 py-3">
        <nav className="space-y-1">
          {items.map((it) => {
            const active = location.pathname === it.to;
            return (
              <Tooltip key={it.key} delayDuration={0}>
                <TooltipTrigger asChild>
                  <Link to={it.to} state={it.state} className="block">
                    <Button
                      variant="ghost"
                      className={`w-full justify-start gap-3 rounded-lg px-3 py-2 text-sm ${
                        active
                          ? "bg-muted/60 dark:bg-muted/40 font-semibold"
                          : "hover:bg-muted/30"
                      }`}
                    >
                      <span className="w-5 h-5 flex items-center justify-center text-xl">
                        {it.icon ?? <DefaultIcon>•</DefaultIcon>}
                      </span>
                      <span className="truncate">{it.label}</span>
                    </Button>
                  </Link>
                </TooltipTrigger>
                <TooltipContent>{it.label}</TooltipContent>
              </Tooltip>
            );
          })}
        </nav>
      </ScrollArea>

      <Separator />

      {/* Bottom: user + actions */}
      <div className="px-3 py-4">
        <div className="mt-3 flex gap-2">
          <Link to="/profile">
            <Button size="sm" variant="outline" className="w-full">
              <User className="w-4 h-4" />
              Profile
            </Button>
          </Link>
          <Link to="/logout">
            <Button size="sm" variant="destructive" className="w-full">
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </Link>
        </div>
      </div>
    </aside>
  );
}
export default NavigationBar;
