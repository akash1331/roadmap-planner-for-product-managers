import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { insertInitiativeSchema, type InsertInitiative, type Team } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";

interface NewInitiativeModalProps {
  isOpen: boolean;
  onClose: () => void;
  teams: Team[];
}

export default function NewInitiativeModal({ isOpen, onClose, teams }: NewInitiativeModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState<Partial<InsertInitiative>>({
    title: "",
    description: "",
    team: undefined,
    priority: undefined,
    startDate: "",
    endDate: "",
    quarter: undefined,
    assignees: [],
    position: 0,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const createMutation = useMutation({
    mutationFn: async (data: InsertInitiative) => {
      const response = await apiRequest("POST", "/api/initiatives", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/initiatives"] });
      toast({
        title: "Success",
        description: "Initiative created successfully",
      });
      handleClose();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create initiative",
        variant: "destructive",
      });
    },
  });

  const determineQuarter = (startDate: string) => {
    if (!startDate) return undefined;
    
    const date = new Date(startDate);
    const month = date.getMonth() + 1; // getMonth() returns 0-11
    
    if (month >= 1 && month <= 3) return "Q1";
    if (month >= 4 && month <= 6) return "Q2";
    if (month >= 7 && month <= 9) return "Q3";
    if (month >= 10 && month <= 12) return "Q4";
    
    return undefined;
  };

  const handleInputChange = (field: keyof InsertInitiative, value: any) => {
    const updatedData = { ...formData, [field]: value };
    
    // Auto-determine quarter when start date changes
    if (field === "startDate") {
      updatedData.quarter = determineQuarter(value);
    }
    
    setFormData(updatedData);
    
    // Clear error for this field
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  const validateForm = () => {
    try {
      insertInitiativeSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error: any) {
      const newErrors: Record<string, string> = {};
      error.errors?.forEach((err: any) => {
        newErrors[err.path[0]] = err.message;
      });
      setErrors(newErrors);
      return false;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    createMutation.mutate(formData as InsertInitiative);
  };

  const handleClose = () => {
    setFormData({
      title: "",
      description: "",
      team: undefined,
      priority: undefined,
      startDate: "",
      endDate: "",
      quarter: undefined,
      assignees: [],
      position: 0,
    });
    setErrors({});
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" data-testid="modal-new-initiative">
        <DialogHeader>
          <DialogTitle>New Initiative</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title || ""}
              onChange={(e) => handleInputChange("title", e.target.value)}
              placeholder="Enter initiative title"
              className={errors.title ? "border-destructive" : ""}
              data-testid="input-title"
            />
            {errors.title && <p className="text-sm text-destructive mt-1">{errors.title}</p>}
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              rows={3}
              value={formData.description || ""}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Describe the initiative"
              className={errors.description ? "border-destructive" : ""}
              data-testid="textarea-description"
            />
            {errors.description && <p className="text-sm text-destructive mt-1">{errors.description}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="team">Team</Label>
              <Select value={formData.team || ""} onValueChange={(value) => handleInputChange("team", value)}>
                <SelectTrigger className={errors.team ? "border-destructive" : ""} data-testid="select-team">
                  <SelectValue placeholder="Select team" />
                </SelectTrigger>
                <SelectContent>
                  {teams.map(team => (
                    <SelectItem key={team.id} value={team.id}>
                      {team.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.team && <p className="text-sm text-destructive mt-1">{errors.team}</p>}
            </div>

            <div>
              <Label htmlFor="priority">Priority</Label>
              <Select value={formData.priority || ""} onValueChange={(value) => handleInputChange("priority", value)}>
                <SelectTrigger className={errors.priority ? "border-destructive" : ""} data-testid="select-priority">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
              {errors.priority && <p className="text-sm text-destructive mt-1">{errors.priority}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate || ""}
                onChange={(e) => handleInputChange("startDate", e.target.value)}
                className={errors.startDate ? "border-destructive" : ""}
                data-testid="input-start-date"
              />
              {errors.startDate && <p className="text-sm text-destructive mt-1">{errors.startDate}</p>}
            </div>

            <div>
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate || ""}
                onChange={(e) => handleInputChange("endDate", e.target.value)}
                className={errors.endDate ? "border-destructive" : ""}
                data-testid="input-end-date"
              />
              {errors.endDate && <p className="text-sm text-destructive mt-1">{errors.endDate}</p>}
            </div>
          </div>

          {formData.quarter && (
            <div>
              <Label>Quarter</Label>
              <div className="text-sm text-muted-foreground">
                Automatically determined: {formData.quarter}
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4 border-t border-border">
            <Button type="button" variant="ghost" onClick={handleClose} data-testid="button-cancel">
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={createMutation.isPending}
              data-testid="button-create"
            >
              {createMutation.isPending ? "Creating..." : "Create Initiative"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
