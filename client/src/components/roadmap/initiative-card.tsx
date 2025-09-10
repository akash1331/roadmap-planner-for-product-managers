import { Initiative } from "@shared/schema";

interface InitiativeCardProps {
  initiative: Initiative;
}

export default function InitiativeCard({ initiative }: InitiativeCardProps) {
  const getTeamColor = (team: string) => {
    const colors = {
      engineering: "border-l-team-engineering",
      design: "border-l-team-design", 
      marketing: "border-l-team-marketing",
      product: "border-l-team-product",
      sales: "border-l-team-sales",
    };
    return colors[team as keyof typeof colors] || "border-l-gray-400";
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      high: "bg-priority-high",
      medium: "bg-priority-medium",
      low: "bg-priority-low",
    };
    return colors[priority as keyof typeof colors] || "bg-gray-400";
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div 
      className={`draggable bg-card border border-border border-l-4 ${getTeamColor(initiative.team)} rounded-lg p-3 shadow-sm cursor-grab hover:shadow-md transition-all duration-200 hover:-translate-y-1`}
      data-team={initiative.team}
      data-priority={initiative.priority}
      data-testid={`card-initiative-${initiative.id}`}
    >
      <div className="flex items-start justify-between mb-2">
        <h4 className="text-sm font-medium text-foreground line-clamp-2" data-testid={`text-title-${initiative.id}`}>
          {initiative.title}
        </h4>
        <span className={`${getPriorityColor(initiative.priority)} w-2 h-2 rounded-full flex-shrink-0 ml-2`}></span>
      </div>
      
      <p className="text-xs text-muted-foreground mb-2 line-clamp-2" data-testid={`text-description-${initiative.id}`}>
        {initiative.description}
      </p>
      
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground" data-testid={`text-dates-${initiative.id}`}>
          {formatDate(initiative.startDate)} - {formatDate(initiative.endDate)}
        </span>
        
        <div className="flex -space-x-1">
          {(initiative.assignees || []).slice(0, 3).map((assignee, index) => (
            <div 
              key={assignee}
              className="w-5 h-5 bg-primary rounded-full border-2 border-white text-xs text-primary-foreground flex items-center justify-center"
              title={assignee}
              data-testid={`avatar-${assignee}-${initiative.id}`}
            >
              {getInitials(assignee)}
            </div>
          ))}
          {(initiative.assignees || []).length > 3 && (
            <div className="w-5 h-5 bg-muted rounded-full border-2 border-white text-xs text-muted-foreground flex items-center justify-center">
              +{(initiative.assignees || []).length - 3}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
