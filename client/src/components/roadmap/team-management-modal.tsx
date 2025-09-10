import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { insertTeamSchema, type InsertTeam, type Team } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Edit } from "lucide-react";

interface TeamManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TeamManagementModal({ isOpen, onClose }: TeamManagementModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [formData, setFormData] = useState<Partial<InsertTeam>>({
    name: "",
    color: "#3b82f6",
    description: "",
  });

  const { data: teams = [], isLoading } = useQuery<Team[]>({
    queryKey: ["/api/teams"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertTeam) => {
      const response = await apiRequest("POST", "/api/teams", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/teams"] });
      queryClient.invalidateQueries({ queryKey: ["/api/initiatives"] });
      toast({
        title: "Success",
        description: "Team created successfully",
      });
      resetForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Team> }) => {
      const response = await apiRequest("PATCH", `/api/teams/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/teams"] });
      queryClient.invalidateQueries({ queryKey: ["/api/initiatives"] });
      toast({
        title: "Success",
        description: "Team updated successfully",
      });
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/teams/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/teams"] });
      queryClient.invalidateQueries({ queryKey: ["/api/initiatives"] });
      toast({
        title: "Success",
        description: "Team deleted successfully",
      });
    },
  });

  const resetForm = () => {
    setFormData({ name: "", color: "#3b82f6", description: "" });
    setShowAddForm(false);
    setEditingTeam(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const validatedData = insertTeamSchema.parse(formData);
      
      if (editingTeam) {
        updateMutation.mutate({ id: editingTeam.id, data: validatedData });
      } else {
        createMutation.mutate(validatedData);
      }
    } catch (error: any) {
      toast({
        title: "Validation Error",
        description: error.errors?.[0]?.message || "Please check your input",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (team: Team) => {
    setEditingTeam(team);
    setFormData({
      name: team.name,
      color: team.color,
      description: team.description || "",
    });
    setShowAddForm(true);
  };

  const handleDelete = (teamId: string) => {
    if (confirm("Are you sure you want to delete this team?")) {
      deleteMutation.mutate(teamId);
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" data-testid="modal-team-management">
        <DialogHeader>
          <DialogTitle>Team Management</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Teams</h3>
            <Button 
              onClick={() => setShowAddForm(true)}
              size="sm"
              data-testid="button-add-team"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Team
            </Button>
          </div>

          {/* Team List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {teams.map(team => (
              <div key={team.id} className="border border-border rounded-lg p-4" data-testid={`team-item-${team.id}`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-4 h-4 rounded" 
                      style={{ backgroundColor: team.color }}
                    ></div>
                    <h4 className="font-semibold">{team.name}</h4>
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleEdit(team)}
                      data-testid={`button-edit-${team.id}`}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleDelete(team.id)}
                      data-testid={`button-delete-${team.id}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                {team.description && (
                  <p className="text-sm text-muted-foreground">{team.description}</p>
                )}
              </div>
            ))}
          </div>

          {/* Add/Edit Team Form */}
          {showAddForm && (
            <div className="border border-border rounded-lg p-4 bg-muted/50">
              <h4 className="font-semibold mb-4">
                {editingTeam ? "Edit Team" : "Add New Team"}
              </h4>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="teamName">Team Name</Label>
                  <Input
                    id="teamName"
                    value={formData.name || ""}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter team name"
                    data-testid="input-team-name"
                  />
                </div>

                <div>
                  <Label htmlFor="teamColor">Team Color</Label>
                  <div className="flex items-center space-x-3">
                    <Input
                      id="teamColor"
                      type="color"
                      value={formData.color || "#3b82f6"}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      className="w-16 h-8"
                      data-testid="input-team-color"
                    />
                    <Input
                      value={formData.color || "#3b82f6"}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      placeholder="#3b82f6"
                      className="flex-1"
                      data-testid="input-team-color-text"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="teamDescription">Description (Optional)</Label>
                  <Textarea
                    id="teamDescription"
                    rows={2}
                    value={formData.description || ""}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe the team's responsibilities"
                    data-testid="textarea-team-description"
                  />
                </div>

                <div className="flex justify-end space-x-3">
                  <Button type="button" variant="ghost" onClick={resetForm} data-testid="button-cancel-team">
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={createMutation.isPending || updateMutation.isPending}
                    data-testid="button-save-team"
                  >
                    {editingTeam ? "Update Team" : "Create Team"}
                  </Button>
                </div>
              </form>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}