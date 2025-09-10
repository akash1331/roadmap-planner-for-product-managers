import { Initiative } from "@shared/schema";
import InitiativeCard from "./initiative-card";

interface TeamSectionProps {
  team: {
    id: string;
    name: string;
    count: number;
  };
  initiatives: Initiative[];
  onDrop?: (quarter: string, teamId: string, initiative: Initiative) => void;
  onDragStart?: (initiative: Initiative, e: React.DragEvent) => void;
  onDragEnd?: (e: React.DragEvent) => void;
  draggingInitiative?: Initiative | null;
}

export default function TeamSection({ 
  team, 
  initiatives, 
  onDrop, 
  onDragStart, 
  onDragEnd, 
  draggingInitiative 
}: TeamSectionProps) {
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

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, quarter: string) => {
    e.preventDefault();
    const initiativeData = e.dataTransfer.getData("application/json");
    if (initiativeData && onDrop) {
      const initiative = JSON.parse(initiativeData);
      onDrop(quarter, team.id, initiative);
    }
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
                className={`${quarter !== "Q4" ? "border-r border-border" : ""} p-4 space-y-3 min-h-32`}
                data-testid={`quarter-${quarter}-${team.id}`}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, quarter)}
              >
                {quarterInitiatives.map(initiative => (
                  <InitiativeCard 
                    key={initiative.id} 
                    initiative={initiative}
                    onDragStart={onDragStart}
                    onDragEnd={onDragEnd}
                    isDragging={draggingInitiative?.id === initiative.id}
                  />
                ))}
                
                {/* Drop zone indicator */}
                {draggingInitiative && (
                  <div className="border-2 border-dashed border-muted-foreground/30 rounded-lg p-3 text-center text-muted-foreground text-sm">
                    Drop here
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
