import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Toobix Universe - Story Engine",
  description: "Interactive narrative system powered by AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-background antialiased">
        <div className="flex min-h-screen">
          {/* Sidebar */}
          <aside className="w-64 shrink-0 border-r bg-card">
            <div className="p-4">
              <h2 className="text-lg font-bold mb-4">⚡ TOOBIX</h2>
              <nav className="space-y-1">
                <Link href="/" className="block px-3 py-2 rounded-lg hover:bg-accent">🏠 Home</Link>
                <Link href="/story" className="block px-3 py-2 rounded-lg hover:bg-accent">📖 Story Engine</Link>
                <Link href="/analytics" className="block px-3 py-2 rounded-lg hover:bg-accent">📊 Analytics</Link>
                <Link href="/people" className="block px-3 py-2 rounded-lg hover:bg-accent">👥 People</Link>
              </nav>
              <div className="mt-4 pt-4 border-t">
                <a href="http://localhost:3000/dashboard.html" target="_blank" className="block px-3 py-2 rounded-lg hover:bg-accent text-sm text-muted-foreground">
                  ← Vanilla UI
                </a>
              </div>
            </div>
          </aside>
          {/* Main Content */}
          <main className="flex-1">{children}</main>
        </div>
      </body>
    </html>
  );
}
