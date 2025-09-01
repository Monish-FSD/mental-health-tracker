import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Activity, BookOpen, Target, Heart, Calendar } from "lucide-react";

interface ActivityItem {
  id: string;
  type: 'mood' | 'journal' | 'goal';
  title: string;
  description?: string;
  created_at: string;
  mood_score?: number;
  is_completed?: boolean;
}

export function RecentActivity() {
  const { user } = useAuth();
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchRecentActivity();
    }
  }, [user]);

  const fetchRecentActivity = async () => {
    if (!user) return;

    try {
      // Fetch recent mood entries
      const { data: moodEntries } = await supabase
        .from("mood_entries")
        .select("id, mood_score, notes, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(3);

      // Fetch recent journal entries
      const { data: journalEntries } = await supabase
        .from("journal_entries")
        .select("id, title, content, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(3);

      // Fetch recent goal updates
      const { data: goalEntries } = await supabase
        .from("goals")
        .select("id, title, is_completed, created_at, completed_at")
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false })
        .limit(3);

      // Combine and format activities
      const allActivities: ActivityItem[] = [];

      // Add mood entries
      moodEntries?.forEach(entry => {
        allActivities.push({
          id: entry.id,
          type: 'mood',
          title: `Logged mood: ${entry.mood_score}/10`,
          description: entry.notes || undefined,
          created_at: entry.created_at,
          mood_score: entry.mood_score,
        });
      });

      // Add journal entries
      journalEntries?.forEach(entry => {
        allActivities.push({
          id: entry.id,
          type: 'journal',
          title: entry.title,
          description: entry.content.length > 100 
            ? entry.content.substring(0, 100) + "..."
            : entry.content,
          created_at: entry.created_at,
        });
      });

      // Add goal entries
      goalEntries?.forEach(entry => {
        allActivities.push({
          id: entry.id,
          type: 'goal',
          title: entry.is_completed ? `Completed: ${entry.title}` : `Created: ${entry.title}`,
          created_at: entry.is_completed ? (entry.completed_at || entry.created_at) : entry.created_at,
          is_completed: entry.is_completed,
        });
      });

      // Sort by date and take most recent 10
      allActivities.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      setActivities(allActivities.slice(0, 10));

    } catch (error) {
      console.error("Error fetching recent activity:", error);
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'mood':
        return <Heart className="h-4 w-4 text-red-500" />;
      case 'journal':
        return <BookOpen className="h-4 w-4 text-blue-500" />;
      case 'goal':
        return <Target className="h-4 w-4 text-green-500" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return date.toLocaleDateString();
  };

  const getMoodColor = (score?: number) => {
    if (!score) return "bg-gray-500";
    if (score >= 8) return "bg-green-500";
    if (score >= 6) return "bg-blue-500";
    if (score >= 4) return "bg-yellow-500";
    return "bg-orange-500";
  };

  if (loading) {
    return (
      <Card className="border-border/50 shadow-gentle">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-1/3"></div>
            {[1, 2, 3].map(i => (
              <div key={i} className="flex space-x-3">
                <div className="h-8 w-8 bg-muted rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/50 shadow-gentle">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Activity className="h-5 w-5 text-primary" />
          <span>Recent Activity</span>
        </CardTitle>
        <CardDescription>
          Your latest mood entries, journal posts, and goal updates
        </CardDescription>
      </CardHeader>
      <CardContent>
        {activities.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">No recent activity. Start by logging your mood!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {activities.map((activity) => (
              <div key={`${activity.type}-${activity.id}`} className="flex items-start space-x-3 pb-3 border-b border-border/50 last:border-b-0 last:pb-0">
                <div className="flex-shrink-0 mt-1">
                  {getActivityIcon(activity.type)}
                </div>
                
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-foreground truncate">
                      {activity.title}
                    </p>
                    <div className="flex items-center space-x-2 flex-shrink-0 ml-2">
                      {activity.type === 'mood' && activity.mood_score && (
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${getMoodColor(activity.mood_score)} text-white border-0`}
                        >
                          {activity.mood_score}/10
                        </Badge>
                      )}
                      {activity.type === 'goal' && activity.is_completed && (
                        <Badge variant="outline" className="text-xs bg-green-100 text-green-800 border-green-200">
                          Completed
                        </Badge>
                      )}
                      <span className="text-xs text-muted-foreground">
                        {formatTimeAgo(activity.created_at)}
                      </span>
                    </div>
                  </div>
                  
                  {activity.description && (
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {activity.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}