import { Initiative } from "@shared/schema";
import InitiativeCard from "./initiative-card";

interface TeamSectionProps {
  team: {
    id: string;
    name: string;
    count: number;
  };
  initiatives: Initiative[];
}

export default function TeamSection({ team, initiatives }: TeamSectionProps) {
  const getTeamColor = (teamId: string) => {
    const colors = {
      engineering: "bg-team-engineering",
      design: "bg-team-design",
      marketing: "bg-team-marketing", 
      product: "bg-team-product",
      sales: "bg-team-sales",
    };
    return colors[teamId as keyof typeof colors] || "bg-gray-400";
  };

  const quarters = ["Q1", "Q2", "Q3", "Q4"];
  
  const getInitiativesForQuarter = (quarter: string) => {
    return initiatives.filter(initiative => initiative.quarter === quarter);
  };

  return (
    <div className="team-section" data-team={team.id} data-testid={`section-team-${team.id}`}>
      <div className="flex items-center space-x-3 mb-4">
        <div className={`w-4 h-4 rounded ${getTeamColor(team.id)}`}></div>
        <h3 className="text-lg font-semibold text-foreground" data-testid={`text-team-name-${team.id}`}>
          {team.name}
        </h3>
        <span className="text-sm text-muted-foreground" data-testid={`text-team-count-${team.id}`}>
          ({team.count} initiatives)
        </span>
      </div>
      
      <div className="timeline-grid relative">
        <div className="grid grid-cols-4 gap-0 min-h-32">
          {quarters.map(quarter => {
            const quarterInitiatives = getInitiativesForQuarter(quarter);
            
            return (
              <div 
                key={quarter}
                className={`${quarter !== "Q4" ? "border-r border-border" : ""} p-4 space-y-3`}
                data-testid={`quarter-${quarter}-${team.id}`}
              >
                {quarterInitiatives.map(initiative => (
                  <InitiativeCard key={initiative.id} initiative={initiative} />
                ))}
                
                {/* Drop zone for drag and drop */}
                <div className="min-h-[20px] w-full" data-drop-zone={`${quarter}-${team.id}`}></div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
