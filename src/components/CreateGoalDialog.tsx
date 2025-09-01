import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface CreateGoalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onGoalCreated: () => void;
}

export function CreateGoalDialog({ open, onOpenChange, onGoalCreated }: CreateGoalDialogProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !title.trim()) {
      toast({
        title: "Please enter a goal title",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from("goals")
        .insert({
          user_id: user.id,
          title: title.trim(),
          description: description.trim() || null,
          target_date: targetDate || null,
        });

      if (error) throw error;

      toast({
        title: "Goal created successfully!",
        description: "Your new goal has been added.",
      });

      // Reset form and close dialog
      setTitle("");
      setDescription("");
      setTargetDate("");
      onOpenChange(false);
      onGoalCreated();

    } catch (error) {
      toast({
        title: "Failed to create goal",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create New Goal</DialogTitle>
            <DialogDescription>
              Set a new goal to help track your mental health progress.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                placeholder="e.g., Meditate for 10 minutes daily"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description">Description (optional)</Label>
              <Textarea
                id="description"
                placeholder="Add more details about your goal..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="targetDate">Target Date (optional)</Label>
              <Input
                id="targetDate"
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!title.trim() || isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Goal"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}