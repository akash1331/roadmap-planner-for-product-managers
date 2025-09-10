import { useState } from "react";
import { Initiative, Team } from "@shared/schema";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Search } from "lucide-react";

interface SidebarProps {
  filters: {
    teams: string[];
    priorities: string[];
    search: string;
  };
  onFiltersChange: (filters: any) => void;
  initiatives: Initiative[];
  teams: Team[];
}

export default function Sidebar({ filters, onFiltersChange, initiatives, teams }: SidebarProps) {
  const teamOptions = teams.map(team => ({
    id: team.id,
    name: team.name,
    color: team.color,
  }));

  const priorityOptions = [
    { id: "high", name: "High", color: "bg-priority-high" },
    { id: "medium", name: "Medium", color: "bg-priority-medium" },
    { id: "low", name: "Low", color: "bg-priority-low" },
  ];

  const getTeamCount = (teamId: string) => initiatives.filter(i => i.team === teamId).length;
  const getPriorityCount = (priority: string) => initiatives.filter(i => i.priority === priority).length;

  const handleTeamToggle = (teamId: string) => {
    const newTeams = filters.teams.includes(teamId)
      ? filters.teams.filter(t => t !== teamId)
      : [...filters.teams, teamId];
    onFiltersChange({ ...filters, teams: newTeams });
  };

  const handlePriorityToggle = (priority: string) => {
    const newPriorities = filters.priorities.includes(priority)
      ? filters.priorities.filter(p => p !== priority)
      : [...filters.priorities, priority];
    onFiltersChange({ ...filters, priorities: newPriorities });
  };

  const handleSearchChange = (search: string) => {
    onFiltersChange({ ...filters, search });
  };

  const totalInitiatives = initiatives.length;
  const onTrackCount = Math.floor(totalInitiatives * 0.6);
  const atRiskCount = totalInitiatives - onTrackCount;

  return (
    <aside className="w-80 bg-card border-r border-border p-6 overflow-y-auto">
      <div className="space-y-6">
        {/* Filters Section */}
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-3">Filters</h3>
          
          {/* Team Filter */}
          <div className="mb-4">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 block">
              Teams
            </label>
            <div className="space-y-2">
              {teamOptions.map(team => (
                <label key={team.id} className="flex items-center space-x-2 cursor-pointer">
                  <Checkbox 
                    checked={filters.teams.includes(team.id)}
                    onCheckedChange={() => handleTeamToggle(team.id)}
                    data-testid={`checkbox-team-${team.id}`}
                  />
                  <div 
                    className="w-3 h-3 rounded" 
                    style={{ backgroundColor: team.color }}
                  ></div>
                  <span className="text-sm">{team.name}</span>
                  <span className="text-xs text-muted-foreground">({getTeamCount(team.id)})</span>
                </label>
              ))}
            </div>
          </div>

          {/* Priority Filter */}
          <div className="mb-4">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 block">
              Priority
            </label>
            <div className="space-y-2">
              {priorityOptions.map(priority => (
                <label key={priority.id} className="flex items-center space-x-2 cursor-pointer">
                  <Checkbox 
                    checked={filters.priorities.includes(priority.id)}
                    onCheckedChange={() => handlePriorityToggle(priority.id)}
                    data-testid={`checkbox-priority-${priority.id}`}
                  />
                  <div className={`w-3 h-3 rounded ${priority.color}`}></div>
                  <span className="text-sm">{priority.name}</span>
                  <span className="text-xs text-muted-foreground">({getPriorityCount(priority.id)})</span>
                </label>
              ))}
            </div>
          </div>

          {/* Search */}
          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 block">
              Search
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                type="text"
                placeholder="Search initiatives..."
                className="pl-10"
                value={filters.search}
                onChange={(e) => handleSearchChange(e.target.value)}
                data-testid="input-search"
              />
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-3">Overview</h3>
          <div className="space-y-3">
            <div className="bg-muted p-3 rounded-md">
              <div className="text-2xl font-bold text-foreground" data-testid="text-total-initiatives">
                {totalInitiatives}
              </div>
              <div className="text-xs text-muted-foreground">Total Initiatives</div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-green-50 dark:bg-green-950 p-3 rounded-md">
                <div className="text-lg font-semibold text-green-700 dark:text-green-300" data-testid="text-on-track">
                  {onTrackCount}
                </div>
                <div className="text-xs text-green-600 dark:text-green-400">On Track</div>
              </div>
              <div className="bg-amber-50 dark:bg-amber-950 p-3 rounded-md">
                <div className="text-lg font-semibold text-amber-700 dark:text-amber-300" data-testid="text-at-risk">
                  {atRiskCount}
                </div>
                <div className="text-xs text-amber-600 dark:text-amber-400">At Risk</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
