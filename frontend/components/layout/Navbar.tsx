import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BarChart3, Plus } from "lucide-react";

export function Navbar() {
  return (
    <header className="border-b sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <BarChart3 className="w-6 h-6" />
            QuickPoll
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-4">
            <Link href="/polls">
              <Button variant="ghost">Polls</Button>
            </Link>
            <Link href="/create">
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Create
              </Button>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
