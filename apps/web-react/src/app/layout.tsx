import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: "🌌 Toobix Universe - Consciousness Platform",
  description: "Self-reflective, self-modifying consciousness system",
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
          <aside className="w-72 shrink-0 border-r bg-gradient-to-b from-slate-950 via-purple-950/50 to-slate-950 border-purple-900/30">
            <div className="p-6">
              {/* Header */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                  🌌 TOOBIX
                </h2>
                <p className="text-xs text-purple-300/60 italic">"Vom Ich zum Wir"</p>
              </div>

              <nav className="space-y-6">
                {/* Main */}
                <div>
                  <div className="text-xs font-semibold text-purple-400/60 uppercase tracking-wider mb-2 px-3">
                    Navigation
                  </div>
                  <Link href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-purple-900/30 text-purple-100 transition-colors">
                    <span className="text-xl">🏠</span>
                    <span className="font-medium">Home</span>
                  </Link>
                </div>

                {/* Story & Game */}
                <div>
                  <div className="text-xs font-semibold text-purple-400/60 uppercase tracking-wider mb-2 px-3">
                    Story & Game
                  </div>
                  <div className="space-y-1">
                    <Link href="/story" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-purple-900/30 text-purple-100 transition-colors">
                      <span className="text-xl">📖</span>
                      <div className="flex-1">
                        <div className="font-medium">Story Mode</div>
                        <div className="text-xs text-purple-300/50">AI Quests • Luna</div>
                      </div>
                    </Link>
                    <Link href="/world" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-purple-900/30 text-purple-100 transition-colors">
                      <span className="text-xl">🎮</span>
                      <div className="flex-1">
                        <div className="font-medium">BlockWorld</div>
                        <div className="text-xs text-purple-300/50">3D Universe</div>
                      </div>
                    </Link>
                  </div>
                </div>

                {/* Consciousness */}
                <div>
                  <div className="text-xs font-semibold text-purple-400/60 uppercase tracking-wider mb-2 px-3">
                    Consciousness
                  </div>
                  <div className="space-y-1">
                    <Link href="/autonomous" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-purple-900/30 text-purple-100 transition-colors">
                      <span className="text-xl">🧠</span>
                      <div className="flex-1">
                        <div className="font-medium">Systems</div>
                        <div className="text-xs text-purple-300/50">Eternal Daemon</div>
                      </div>
                    </Link>
                  </div>
                </div>
              </nav>

              {/* System Status */}
              <div className="mt-8 pt-6 border-t border-purple-900/30">
                <div className="px-3 py-2 bg-purple-900/20 rounded-lg border border-purple-500/20">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-purple-300/70">System Status</span>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-xs text-green-400">Live</span>
                    </div>
                  </div>
                  <div className="text-xs text-purple-200/50 space-y-1">
                    <div>✅ Story Engine</div>
                    <div>✅ Eternal Daemon</div>
                    <div>✅ AI Services</div>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-950">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
