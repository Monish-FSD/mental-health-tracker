import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Heart, BookOpen, Target, TrendingUp, ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-peaceful to-zen">
      {/* Header */}
      <header className="container mx-auto px-6 py-8">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Brain className="h-8 w-8 text-primary" />
            <Heart className="h-6 w-6 text-destructive" />
            <span className="text-2xl font-bold text-foreground">MindfulSpace</span>
          </div>
          <div className="space-x-4">
            <Button variant="ghost" asChild>
              <Link to="/auth">Sign In</Link>
            </Button>
            <Button asChild>
              <Link to="/auth">Get Started</Link>
            </Button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-bold text-foreground leading-tight">
              Your Journey to
              <span className="block text-primary">Mental Wellness</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Track your mood, journal your thoughts, set meaningful goals, and discover patterns in your mental health journey with MindfulSpace.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8 py-6" asChild>
              <Link to="/auth">
                Start Your Journey
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6">
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl font-bold text-foreground">Everything You Need</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Comprehensive tools designed to support your mental health and well-being
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="border-border/50 shadow-gentle hover:shadow-floating transition-all duration-300">
            <CardHeader className="text-center space-y-4">
              <div className="mx-auto p-4 rounded-full bg-primary/10">
                <Heart className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-2xl">Mood Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center text-base">
                Log your daily emotions and mood levels. Identify patterns and triggers to better understand your mental health journey.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-border/50 shadow-gentle hover:shadow-floating transition-all duration-300">
            <CardHeader className="text-center space-y-4">
              <div className="mx-auto p-4 rounded-full bg-primary/10">
                <BookOpen className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-2xl">Digital Journal</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center text-base">
                Express your thoughts and feelings through writing. Create entries with tags and track your emotional growth over time.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-border/50 shadow-gentle hover:shadow-floating transition-all duration-300">
            <CardHeader className="text-center space-y-4">
              <div className="mx-auto p-4 rounded-full bg-primary/10">
                <Target className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-2xl">Goal Setting</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center text-base">
                Set meaningful wellness goals and track your progress. Celebrate achievements and stay motivated on your journey.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="container mx-auto px-6 py-20 bg-card/50 rounded-3xl mx-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-4xl font-bold text-foreground">
              Why Choose MindfulSpace?
            </h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Sparkles className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-lg">Science-Based Approach</h3>
                  <p className="text-muted-foreground">Built on proven psychological principles and research-backed methodologies.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <TrendingUp className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-lg">Progress Tracking</h3>
                  <p className="text-muted-foreground">Visualize your mental health journey with insights and patterns over time.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Brain className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-lg">Privacy First</h3>
                  <p className="text-muted-foreground">Your data is secure, encrypted, and completely private. Only you have access.</p>
                </div>
              </div>
            </div>
            <Button size="lg" className="mt-8" asChild>
              <Link to="/auth">
                Get Started Today
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <Card className="p-6 text-center border-border/50">
              <div className="text-3xl font-bold text-primary mb-2">10K+</div>
              <p className="text-sm text-muted-foreground">Active Users</p>
            </Card>
            <Card className="p-6 text-center border-border/50">
              <div className="text-3xl font-bold text-primary mb-2">95%</div>
              <p className="text-sm text-muted-foreground">User Satisfaction</p>
            </Card>
            <Card className="p-6 text-center border-border/50">
              <div className="text-3xl font-bold text-primary mb-2">50K+</div>
              <p className="text-sm text-muted-foreground">Journal Entries</p>
            </Card>
            <Card className="p-6 text-center border-border/50">
              <div className="text-3xl font-bold text-primary mb-2">24/7</div>
              <p className="text-sm text-muted-foreground">Always Available</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-6 py-12 text-center">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <Brain className="h-6 w-6 text-primary" />
          <Heart className="h-5 w-5 text-destructive" />
          <span className="text-xl font-bold text-foreground">MindfulSpace</span>
        </div>
        <p className="text-muted-foreground">
          Supporting your mental health journey, one step at a time.
        </p>
        <div className="mt-8 pt-8 border-t border-border/50">
          <p className="text-sm text-muted-foreground">
            © 2024 MindfulSpace. All rights reserved. Your privacy and well-being are our priority.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
