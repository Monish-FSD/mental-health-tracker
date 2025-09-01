import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Target, Plus, CheckCircle, Calendar } from "lucide-react";
import { CreateGoalDialog } from "./CreateGoalDialog";

interface Goal {
  id: string;
  title: string;
  description?: string;
  target_date?: string;
  is_completed: boolean;
  completed_at?: string;
  created_at: string;
}

export function GoalsOverview() {
  const { user } = useAuth();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  useEffect(() => {
    if (user) {
      fetchGoals();
    }
  }, [user]);

  const fetchGoals = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("goals")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(5);

      if (error) throw error;
      setGoals(data || []);
    } catch (error) {
      console.error("Error fetching goals:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleGoal = async (goalId: string, isCompleted: boolean) => {
    try {
      const { error } = await supabase
        .from("goals")
        .update({
          is_completed: !isCompleted,
          completed_at: !isCompleted ? new Date().toISOString() : null,
        })
        .eq("id", goalId);

      if (error) throw error;
      
      // Refresh goals
      fetchGoals();
    } catch (error) {
      console.error("Error updating goal:", error);
    }
  };

  const getProgressPercentage = () => {
    if (goals.length === 0) return 0;
    const completedGoals = goals.filter(goal => goal.is_completed).length;
    return Math.round((completedGoals / goals.length) * 100);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const isOverdue = (targetDate: string) => {
    return new Date(targetDate) < new Date() && targetDate !== null;
  };

  if (loading) {
    return (
      <Card className="border-border/50 shadow-gentle">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-1/4"></div>
            <div className="h-8 bg-muted rounded"></div>
            <div className="h-4 bg-muted rounded w-3/4"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="border-border/50 shadow-gentle">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Target className="h-5 w-5 text-primary" />
                <span>Goals Overview</span>
              </CardTitle>
              <CardDescription>
                Track your mental health and wellness goals
              </CardDescription>
            </div>
            <Button size="sm" onClick={() => setShowCreateDialog(true)}>
              <Plus className="h-4 w-4 mr-1" />
              Add Goal
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Progress Summary */}
          {goals.length > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Overall Progress</span>
                <span>{getProgressPercentage()}%</span>
              </div>
              <Progress value={getProgressPercentage()} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {goals.filter(g => g.is_completed).length} of {goals.length} goals completed
              </p>
            </div>
          )}

          {/* Goals List */}
          <div className="space-y-3">
            {goals.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground">
                <Target className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">No goals yet. Create your first goal!</p>
              </div>
            ) : (
              goals.map((goal) => (
                <div
                  key={goal.id}
                  className={`p-3 border rounded-lg space-y-2 ${
                    goal.is_completed ? "bg-green-50 border-green-200 dark:bg-green-900/20" : "bg-card"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => toggleGoal(goal.id, goal.is_completed)}
                          className="flex-shrink-0"
                        >
                          <CheckCircle
                            className={`h-5 w-5 ${
                              goal.is_completed
                                ? "text-green-600 fill-current"
                                : "text-muted-foreground hover:text-primary"
                            }`}
                          />
                        </button>
                        <h4 className={`font-medium text-sm ${
                          goal.is_completed ? "line-through text-muted-foreground" : ""
                        }`}>
                          {goal.title}
                        </h4>
                      </div>
                      
                      {goal.description && (
                        <p className="text-xs text-muted-foreground pl-7">
                          {goal.description}
                        </p>
                      )}
                      
                      {goal.target_date && (
                        <div className="flex items-center space-x-1 pl-7">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">
                            Due: {formatDate(goal.target_date)}
                          </span>
                          {!goal.is_completed && isOverdue(goal.target_date) && (
                            <Badge variant="destructive" className="text-xs ml-1">
                              Overdue
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {goals.length > 0 && (
            <div className="pt-2 border-t">
              <Button variant="outline" size="sm" className="w-full">
                View All Goals
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <CreateGoalDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onGoalCreated={fetchGoals}
      />
    </>
  );
}