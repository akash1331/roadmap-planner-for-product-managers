import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Initiative } from "@shared/schema";
import TimelineHeader from "../components/roadmap/timeline-header";
import Sidebar from "../components/roadmap/sidebar";
import TeamSection from "../components/roadmap/team-section";
import NewInitiativeModal from "../components/roadmap/new-initiative-modal";
import { Button } from "@/components/ui/button";
import { Download, Plus, User } from "lucide-react";

export default function Roadmap() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    teams: ["engineering", "design", "product", "marketing", "sales"],
    priorities: ["high", "medium", "low"],
    search: "",
  });

  const { data: initiatives = [], isLoading } = useQuery<Initiative[]>({
    queryKey: ["/api/initiatives"],
  });

  const filteredInitiatives = initiatives.filter(initiative => {
    const matchesTeam = filters.teams.includes(initiative.team);
    const matchesPriority = filters.priorities.includes(initiative.priority);
    const matchesSearch = initiative.title.toLowerCase().includes(filters.search.toLowerCase()) ||
                         initiative.description.toLowerCase().includes(filters.search.toLowerCase());
    
    return matchesTeam && matchesPriority && matchesSearch;
  });

  const teams = [
    { id: "engineering", name: "Engineering", count: filteredInitiatives.filter(i => i.team === "engineering").length },
    { id: "design", name: "Design", count: filteredInitiatives.filter(i => i.team === "design").length },
    { id: "product", name: "Product", count: filteredInitiatives.filter(i => i.team === "product").length },
    { id: "marketing", name: "Marketing", count: filteredInitiatives.filter(i => i.team === "marketing").length },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Loading roadmap...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border px-6 py-4 sticky top-0 z-40">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-foreground">Product Roadmap</h1>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <span>2024 Roadmap</span>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="secondary" size="sm" data-testid="button-export">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button 
              onClick={() => setIsModalOpen(true)} 
              size="sm"
              data-testid="button-new-initiative"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Initiative
            </Button>
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-medium">
              <User className="w-4 h-4" />
            </div>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Sidebar */}
        <Sidebar 
          filters={filters}
          onFiltersChange={setFilters}
          initiatives={filteredInitiatives}
        />

        {/* Main Timeline */}
        <main className="flex-1 overflow-auto">
          <TimelineHeader />
          
          <div className="p-6">
            <div className="space-y-8">
              {teams.map(team => (
                <TeamSection
                  key={team.id}
                  team={team}
                  initiatives={filteredInitiatives.filter(i => i.team === team.id)}
                />
              ))}
            </div>
          </div>
        </main>
      </div>

      <NewInitiativeModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
