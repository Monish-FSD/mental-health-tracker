import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { BookOpen, Plus, X } from "lucide-react";

const suggestedTags = [
  "Gratitude", "Reflection", "Goals", "Anxiety", "Happiness", 
  "Work", "Relationships", "Health", "Personal Growth", "Challenges"
];

export function QuickJournal() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [customTag, setCustomTag] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const addCustomTag = () => {
    if (customTag.trim() && !selectedTags.includes(customTag.trim())) {
      setSelectedTags(prev => [...prev, customTag.trim()]);
      setCustomTag("");
    }
  };

  const removeTag = (tag: string) => {
    setSelectedTags(prev => prev.filter(t => t !== tag));
  };

  const handleSubmit = async () => {
    if (!user || !title.trim() || !content.trim()) {
      toast({
        title: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from("journal_entries")
        .insert({
          user_id: user.id,
          title: title.trim(),
          content: content.trim(),
          tags: selectedTags.length > 0 ? selectedTags : null,
        });

      if (error) throw error;

      toast({
        title: "Journal entry saved!",
        description: "Your thoughts have been recorded.",
      });

      // Reset form
      setTitle("");
      setContent("");
      setSelectedTags([]);

    } catch (error) {
      toast({
        title: "Failed to save entry",
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
          <BookOpen className="h-5 w-5 text-primary" />
          <span>Quick Journal</span>
        </CardTitle>
        <CardDescription>
          Express your thoughts and feelings in writing
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Title */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Title *</label>
          <Input
            placeholder="What's on your mind today?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {/* Content */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Your thoughts *</label>
          <Textarea
            placeholder="Write about your day, feelings, thoughts, or anything that comes to mind..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
          />
        </div>

        {/* Tags */}
        <div className="space-y-3">
          <label className="text-sm font-medium">Tags (optional)</label>
          
          {/* Suggested Tags */}
          <div className="flex flex-wrap gap-2">
            {suggestedTags.map((tag) => (
              <Badge
                key={tag}
                variant={selectedTags.includes(tag) ? "default" : "outline"}
                className="cursor-pointer text-xs"
                onClick={() => toggleTag(tag)}
              >
                {tag}
              </Badge>
            ))}
          </div>

          {/* Custom Tag Input */}
          <div className="flex space-x-2">
            <Input
              placeholder="Add custom tag"
              value={customTag}
              onChange={(e) => setCustomTag(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addCustomTag();
                }
              }}
              className="flex-1"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addCustomTag}
              disabled={!customTag.trim()}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {/* Selected Tags */}
          {selectedTags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {selectedTags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                  <button
                    onClick={() => removeTag(tag)}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Submit */}
        <Button 
          onClick={handleSubmit}
          disabled={!title.trim() || !content.trim() || isSubmitting}
          className="w-full"
        >
          {isSubmitting ? "Saving entry..." : "Save Entry"}
        </Button>
      </CardContent>
    </Card>
  );
}