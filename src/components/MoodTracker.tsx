import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Smile, Frown, Meh, Heart, Zap, Sun, Cloud, CloudRain } from "lucide-react";

interface MoodTrackerProps {
  onMoodLogged?: () => void;
}

const moodLevels = [
  { value: 1, label: "Terrible", icon: <CloudRain className="h-5 w-5" />, color: "bg-red-500" },
  { value: 2, label: "Bad", icon: <Frown className="h-5 w-5" />, color: "bg-orange-500" },
  { value: 3, label: "Poor", icon: <Cloud className="h-5 w-5" />, color: "bg-yellow-500" },
  { value: 4, label: "Below Average", icon: <Meh className="h-5 w-5" />, color: "bg-yellow-400" },
  { value: 5, label: "Average", icon: <Meh className="h-5 w-5" />, color: "bg-blue-400" },
  { value: 6, label: "Above Average", icon: <Smile className="h-5 w-5" />, color: "bg-green-400" },
  { value: 7, label: "Good", icon: <Sun className="h-5 w-5" />, color: "bg-green-500" },
  { value: 8, label: "Great", icon: <Heart className="h-5 w-5" />, color: "bg-green-600" },
  { value: 9, label: "Amazing", icon: <Zap className="h-5 w-5" />, color: "bg-emerald-500" },
  { value: 10, label: "Perfect", icon: <Sun className="h-5 w-5" />, color: "bg-emerald-600" },
];

const emotionOptions = [
  "Happy", "Sad", "Anxious", "Calm", "Excited", "Worried", 
  "Content", "Frustrated", "Hopeful", "Tired", "Energetic", "Peaceful"
];

export function MoodTracker({ onMoodLogged }: MoodTrackerProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleEmotion = (emotion: string) => {
    setSelectedEmotions(prev => 
      prev.includes(emotion) 
        ? prev.filter(e => e !== emotion)
        : [...prev, emotion]
    );
  };

  const handleSubmit = async () => {
    if (!user || !selectedMood) {
      toast({
        title: "Please select a mood",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from("mood_entries")
        .insert({
          user_id: user.id,
          mood_score: selectedMood,
          emotions: selectedEmotions,
          notes: notes.trim() || null,
        });

      if (error) throw error;

      toast({
        title: "Mood logged successfully!",
        description: "Your mood has been recorded.",
      });

      // Reset form
      setSelectedMood(null);
      setSelectedEmotions([]);
      setNotes("");
      
      // Notify parent to refresh data
      onMoodLogged?.();

    } catch (error) {
      toast({
        title: "Failed to log mood",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="border-border/50 shadow-gentle">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Heart className="h-5 w-5 text-primary" />
          <span>How are you feeling?</span>
        </CardTitle>
        <CardDescription>
          Track your mood to better understand your mental health patterns
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Mood Scale */}
        <div className="space-y-3">
          <p className="text-sm font-medium">Select your mood (1-10)</p>
          <div className="grid grid-cols-5 gap-2">
            {moodLevels.map((mood) => (
              <Button
                key={mood.value}
                variant={selectedMood === mood.value ? "default" : "outline"}
                size="sm"
                className={`flex flex-col items-center space-y-1 h-auto p-3 ${
                  selectedMood === mood.value ? mood.color + " text-white" : ""
                }`}
                onClick={() => setSelectedMood(mood.value)}
              >
                {mood.icon}
                <span className="text-xs">{mood.value}</span>
              </Button>
            ))}
          </div>
          {selectedMood && (
            <p className="text-sm text-muted-foreground text-center">
              Selected: {moodLevels.find(m => m.value === selectedMood)?.label}
            </p>
          )}
        </div>

        {/* Emotions */}
        <div className="space-y-3">
          <p className="text-sm font-medium">What emotions are you experiencing? (optional)</p>
          <div className="flex flex-wrap gap-2">
            {emotionOptions.map((emotion) => (
              <Badge
                key={emotion}
                variant={selectedEmotions.includes(emotion) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => toggleEmotion(emotion)}
              >
                {emotion}
              </Badge>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div className="space-y-3">
          <p className="text-sm font-medium">Additional notes (optional)</p>
          <Textarea
            placeholder="How was your day? What influenced your mood?"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
          />
        </div>

        {/* Submit */}
        <Button 
          onClick={handleSubmit}
          disabled={!selectedMood || isSubmitting}
          className="w-full"
        >
          {isSubmitting ? "Logging mood..." : "Log Mood"}
        </Button>
      </CardContent>
    </Card>
  );
}