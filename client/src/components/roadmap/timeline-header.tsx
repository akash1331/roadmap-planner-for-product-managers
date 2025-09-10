import { Button } from "@/components/ui/button";

export default function TimelineHeader() {
  return (
    <div className="bg-card border-b border-border sticky top-0 z-30">
      {/* Year Header */}
      <div className="px-6 py-3 border-b border-border">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">2024 Product Roadmap</h2>
          <div className="flex items-center space-x-2">
            <Button variant="secondary" size="sm" data-testid="button-quarters">
              Quarters
            </Button>
            <Button variant="ghost" size="sm" data-testid="button-months">
              Months
            </Button>
            <Button variant="ghost" size="sm" data-testid="button-weeks">
              Weeks
            </Button>
          </div>
        </div>
      </div>
      
      {/* Quarter Headers */}
      <div className="timeline-grid px-6">
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
      </div>
    </div>
  );
}
