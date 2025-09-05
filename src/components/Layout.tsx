import ThemeToggle from "./ThemeToggle";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors">
      {/* Header */}
      <header className="flex justify-between items-center px-6 py-4 border-b border-border">
        <h1 className="text-xl font-bold">MindfulSpace</h1>
        <ThemeToggle />
      </header>

      {/* Main content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="p-4 text-center text-sm text-muted-foreground border-t border-border">
        © {new Date().getFullYear()} MindfulSpace. All rights reserved.
      </footer>
    </div>
  );
}
