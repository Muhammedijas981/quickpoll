import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BarChart3, Plus, Users } from "lucide-react";

export default function Home() {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center space-y-6 py-12">
        <h1 className="text-5xl font-bold tracking-tight">
          Welcome to QuickPoll
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Create and participate in real-time polls. See results update live as
          others vote.
        </p>
        <div className="flex gap-4 justify-center pt-4">
          <Link href="/polls">
            <Button size="lg" className="gap-2">
              <BarChart3 className="w-5 h-5" />
              View Polls
            </Button>
          </Link>
          <Link href="/create">
            <Button size="lg" variant="outline" className="gap-2">
              <Plus className="w-5 h-5" />
              Create Poll
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Real-Time Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Watch poll results update instantly as other users vote. No
              refresh needed.
            </CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Easy Creation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Create polls in seconds. Add multiple options and share with your
              audience.
            </CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Engage & Like
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Vote on polls and like your favorites. Interact with the community
              in real-time.
            </CardDescription>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
