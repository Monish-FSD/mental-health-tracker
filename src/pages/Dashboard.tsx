import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Brain, BookOpen, Target, TrendingUp, Calendar, Smile, Frown, Meh, LogOut } from "lucide-react";
import { MoodTracker } from "@/components/MoodTracker";
import { QuickJournal } from "@/components/QuickJournal";
import { GoalsOverview } from "@/components/GoalsOverview";
import { RecentActivity } from "@/components/RecentActivity";

interface MoodEntry {
  id: string;
  mood_score: number;
  created_at: string;
}

interface Profile {
  first_name?: string;
  last_name?: string;
}

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile>({});
  const [recentMoodEntries, setRecentMoodEntries] = useState<MoodEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }

    fetchProfile();
    fetchRecentMoodEntries();
  }, [user, navigate]);

  const fetchProfile = async () => {
    if (!user) return;

    const { data } = await supabase
      .from("profiles")
      .select("first_name, last_name")
      .eq("user_id", user.id)
      .single();

    if (data) {
      setProfile(data);
    }
    setLoading(false);
  };

  const fetchRecentMoodEntries = async () => {
    if (!user) return;

    const { data } = await supabase
      .from("mood_entries")
      .select("id, mood_score, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(7);

    if (data) {
      setRecentMoodEntries(data);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const getAverageMood = () => {
    if (recentMoodEntries.length === 0) return 0;
    const sum = recentMoodEntries.reduce((acc, entry) => acc + entry.mood_score, 0);
    return Math.round(sum / recentMoodEntries.length);
  };

  const getMoodIcon = (score: number) => {
    if (score >= 7) return <Smile className="h-6 w-6 text-green-500" />;
    if (score >= 4) return <Meh className="h-6 w-6 text-yellow-500" />;
    return <Frown className="h-6 w-6 text-orange-500" />;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-peaceful">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <Brain className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold text-foreground">MindfulSpace</h1>
            </div>
            <p className="text-lg text-muted-foreground">
              Welcome back, {profile.first_name || "Friend"}! 
            </p>
          </div>
          <Button variant="outline" onClick={handleSignOut}>
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-border/50 shadow-soft">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Mood</CardTitle>
              {getMoodIcon(getAverageMood())}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{getAverageMood()}/10</div>
              <p className="text-xs text-muted-foreground">7-day average</p>
            </CardContent>
          </Card>

          <Card className="border-border/50 shadow-soft">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Entries</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{recentMoodEntries.length}</div>
              <p className="text-xs text-muted-foreground">This week</p>
            </CardContent>
          </Card>

          <Card className="border-border/50 shadow-soft">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Streak</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">7</div>
              <p className="text-xs text-muted-foreground">Day streak</p>
            </CardContent>
          </Card>

          <Card className="border-border/50 shadow-soft">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Goals</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">Active goals</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            <MoodTracker onMoodLogged={fetchRecentMoodEntries} />
            <QuickJournal />
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <GoalsOverview />
            <RecentActivity />
          </div>
        </div>
      </div>
    </div>
  );
}