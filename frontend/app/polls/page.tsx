import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PollList } from "@/components/polls/PollList";
import { Plus } from "lucide-react";

export default function PollsPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">All Polls</h1>
          <p className="text-muted-foreground mt-2">
            Vote on existing polls or create your own
          </p>
        </div>
        <Link href="/create">
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Create Poll
          </Button>
        </Link>
      </div>
      <PollList />
    </div>
  );
}
