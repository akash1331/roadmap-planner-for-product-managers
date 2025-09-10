import { Button } from "@/components/ui/button";

interface TimelineHeaderProps {
  timelineView: "quarters" | "months" | "weeks" | "days";
  onTimelineViewChange: (view: "quarters" | "months" | "weeks" | "days") => void;
  selectedMonth?: number;
  onMonthChange?: (month: number) => void;
}

export default function TimelineHeader({ 
  timelineView, 
  onTimelineViewChange,
  selectedMonth = 0,
  onMonthChange
}: TimelineHeaderProps) {
  return (
    <div className="bg-card border-b border-border sticky top-0 z-30">
      {/* Year Header */}
      <div className="px-6 py-3 border-b border-border">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">2024 Product Roadmap</h2>
          <div className="flex items-center space-x-2">
            <Button 
              variant={timelineView === "quarters" ? "secondary" : "ghost"} 
              size="sm" 
              onClick={() => onTimelineViewChange("quarters")}
              data-testid="button-quarters"
            >
              Quarters
            </Button>
            <Button 
              variant={timelineView === "months" ? "secondary" : "ghost"} 
              size="sm" 
              onClick={() => onTimelineViewChange("months")}
              data-testid="button-months"
            >
              Months
            </Button>
            <Button 
              variant={timelineView === "weeks" ? "secondary" : "ghost"} 
              size="sm" 
              onClick={() => onTimelineViewChange("weeks")}
              data-testid="button-weeks"
            >
              Weeks
            </Button>
            <Button 
              variant={timelineView === "days" ? "secondary" : "ghost"} 
              size="sm" 
              onClick={() => onTimelineViewChange("days")}
              data-testid="button-days"
            >
              Days
            </Button>
          </div>
        </div>
      </div>
      
      {/* Time Period Headers */}
      <div className="timeline-grid px-6">
        {timelineView === "quarters" && (
          <div className="grid grid-cols-4 gap-0 min-w-max">
            <div className="px-4 py-3 text-center border-r border-border">
              <div className="font-semibold text-foreground">Q1 2024</div>
              <div className="text-xs text-muted-foreground">Jan - Mar</div>
            </div>
            <div className="px-4 py-3 text-center border-r border-border">
              <div className="font-semibold text-foreground">Q2 2024</div>
              <div className="text-xs text-muted-foreground">Apr - Jun</div>
            </div>
            <div className="px-4 py-3 text-center border-r border-border">
              <div className="font-semibold text-foreground">Q3 2024</div>
              <div className="text-xs text-muted-foreground">Jul - Sep</div>
            </div>
            <div className="px-4 py-3 text-center">
              <div className="font-semibold text-foreground">Q4 2024</div>
              <div className="text-xs text-muted-foreground">Oct - Dec</div>
            </div>
          </div>
        )}

        {timelineView === "months" && (
          <div className="grid grid-cols-12 gap-0 min-w-max">
            {[
              "Jan", "Feb", "Mar", "Apr", "May", "Jun",
              "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
            ].map((month, index) => (
              <div key={month} className={`px-2 py-3 text-center ${index < 11 ? 'border-r border-border' : ''}`}>
                <div className="font-semibold text-foreground text-sm">{month}</div>
                <div className="text-xs text-muted-foreground">2024</div>
              </div>
            ))}
          </div>
        )}

        {timelineView === "weeks" && (
          <div className="grid gap-0 min-w-max overflow-x-auto" style={{ gridTemplateColumns: 'repeat(52, minmax(80px, 1fr))' }}>
            {Array.from({ length: 52 }, (_, index) => {
              const weekNum = index + 1;
              const startDate = new Date(2024, 0, 1 + (index * 7));
              const monthName = startDate.toLocaleDateString('en-US', { month: 'short' });
              
              return (
                <div key={weekNum} className={`px-1 py-3 text-center ${index < 51 ? 'border-r border-border' : ''}`}>
                  <div className="font-semibold text-foreground text-xs">W{weekNum}</div>
                  <div className="text-xs text-muted-foreground">{monthName}</div>
                </div>
              );
            })}
          </div>
        )}

        {timelineView === "days" && (
          <div className="flex items-center space-x-4 mb-4">
            <select 
              value={selectedMonth} 
              onChange={(e) => onMonthChange?.(parseInt(e.target.value))}
              className="px-3 py-1 border border-border rounded bg-background text-foreground"
            >
              {[
                "January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"
              ].map((month, index) => (
                <option key={index} value={index}>{month} 2024</option>
              ))}
            </select>
          </div>
        )}

        {timelineView === "days" && (
          <div className="grid gap-0 min-w-max overflow-x-auto" style={{ gridTemplateColumns: 'repeat(31, minmax(60px, 1fr))' }}>
            {Array.from({ length: new Date(2024, selectedMonth + 1, 0).getDate() }, (_, index) => {
              const day = index + 1;
              const date = new Date(2024, selectedMonth, day);
              const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
              
              return (
                <div key={day} className={`px-1 py-3 text-center ${index < new Date(2024, selectedMonth + 1, 0).getDate() - 1 ? 'border-r border-border' : ''}`}>
                  <div className="font-semibold text-foreground text-xs">{day}</div>
                  <div className="text-xs text-muted-foreground">{dayName}</div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
