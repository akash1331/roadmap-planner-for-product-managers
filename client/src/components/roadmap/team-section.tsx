import { Initiative } from "@shared/schema";
import InitiativeCard from "./initiative-card";

interface TeamSectionProps {
  team: {
    id: string;
    name: string;
    color?: string;
    count: number;
  };
  initiatives: Initiative[];
  timelineView: "quarters" | "months" | "weeks" | "days";
  selectedMonth?: number;
  onDrop?: (period: string, teamId: string, initiative: Initiative) => void;
  onDragStart?: (initiative: Initiative, e: React.DragEvent) => void;
  onDragEnd?: (e: React.DragEvent) => void;
  draggingInitiative?: Initiative | null;
}

export default function TeamSection({ 
  team, 
  initiatives, 
  timelineView,
  selectedMonth = 0,
  onDrop, 
  onDragStart, 
  onDragEnd, 
  draggingInitiative 
}: TeamSectionProps) {
  const getTeamColor = (teamId: string) => {
    // This function is no longer needed since we'll use inline styles
    return "bg-gray-400";
  };

  const getTimePeriods = () => {
    switch (timelineView) {
      case "quarters":
        return ["Q1", "Q2", "Q3", "Q4"];
      case "months":
        return ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      case "weeks":
        return Array.from({ length: 52 }, (_, i) => `W${i + 1}`);
      case "days":
        const daysInMonth = new Date(2024, selectedMonth + 1, 0).getDate();
        return Array.from({ length: daysInMonth }, (_, i) => `D${i + 1}`);
      default:
        return ["Q1", "Q2", "Q3", "Q4"];
    }
  };

  const getInitiativesForPeriod = (period: string) => {
    switch (timelineView) {
      case "quarters":
        return initiatives.filter(initiative => initiative.quarter === period);
      case "months":
        const monthIndex = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].indexOf(period);
        return initiatives.filter(initiative => {
          const startDate = new Date(initiative.startDate);
          const endDate = new Date(initiative.endDate);
          return startDate.getMonth() <= monthIndex && endDate.getMonth() >= monthIndex;
        });
      case "weeks":
        const weekNum = parseInt(period.substring(1));
        return initiatives.filter(initiative => {
          const startDate = new Date(initiative.startDate);
          const endDate = new Date(initiative.endDate);
          const startWeek = Math.ceil((startDate.getTime() - new Date(2024, 0, 1).getTime()) / (7 * 24 * 60 * 60 * 1000));
          const endWeek = Math.ceil((endDate.getTime() - new Date(2024, 0, 1).getTime()) / (7 * 24 * 60 * 60 * 1000));
          return startWeek <= weekNum && endWeek >= weekNum;
        });
      case "days":
        const dayNum = parseInt(period.substring(1));
        const targetDate = new Date(2024, selectedMonth, dayNum);
        return initiatives.filter(initiative => {
          const startDate = new Date(initiative.startDate);
          const endDate = new Date(initiative.endDate);
          return startDate <= targetDate && endDate >= targetDate;
        });
      default:
        return [];
    }
  };

  const getGridCols = () => {
    switch (timelineView) {
      case "quarters": return "grid-cols-4";
      case "months": return "grid-cols-12";
      case "weeks": return "grid-flow-col auto-cols-[80px]";
      case "days": return "grid-flow-col auto-cols-[60px]";
      default: return "grid-cols-4";
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, period: string) => {
    e.preventDefault();
    const initiativeData = e.dataTransfer.getData("application/json");
    if (initiativeData && onDrop) {
      const initiative = JSON.parse(initiativeData);
      onDrop(period, team.id, initiative);
    }
  };

  return (
    <div className="team-section" data-team={team.id} data-testid={`section-team-${team.id}`}>
      <div className="flex items-center space-x-3 mb-4">
        <div 
          className="w-4 h-4 rounded" 
          style={{ backgroundColor: team.color || "#6b7280" }}
        ></div>
        <h3 className="text-lg font-semibold text-foreground" data-testid={`text-team-name-${team.id}`}>
          {team.name}
        </h3>
        <span className="text-sm text-muted-foreground" data-testid={`text-team-count-${team.id}`}>
          ({team.count} initiatives)
        </span>
      </div>
      
      <div className="timeline-grid relative">
        <div className={`grid gap-0 min-h-32 ${getGridCols()}`}>
          {getTimePeriods().map((period, index) => {
            const periodInitiatives = getInitiativesForPeriod(period);
            const isLastPeriod = index === getTimePeriods().length - 1;
            
            return (
              <div 
                key={period}
                className={`${!isLastPeriod ? "border-r border-border" : ""} p-2 space-y-2 min-h-32 ${timelineView === "weeks" ? "min-w-[80px]" : ""} ${timelineView === "days" ? "min-w-[60px]" : ""}`}
                data-testid={`period-${period}-${team.id}`}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, period)}
              >
                {periodInitiatives.map(initiative => (
                  <InitiativeCard 
                    key={initiative.id} 
                    initiative={initiative}
                    teamColor={team.color}
                    onDragStart={onDragStart}
                    onDragEnd={onDragEnd}
                    isDragging={draggingInitiative?.id === initiative.id}
                  />
                ))}
                
                {/* Drop zone indicator */}
                {draggingInitiative && periodInitiatives.length === 0 && (
                  <div className="border-2 border-dashed border-muted-foreground/30 rounded-lg p-2 text-center text-muted-foreground text-xs">
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
