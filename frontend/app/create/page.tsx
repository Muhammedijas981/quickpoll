import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CreatePollForm } from "@/components/polls/CreatePollForm";
import { ArrowLeft } from "lucide-react";

export default function CreatePollPage() {
  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link href="/polls">
        <Button variant="ghost" className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to Polls
        </Button>
      </Link>

      {/* Form */}
      <CreatePollForm />
    </div>
  );
}
