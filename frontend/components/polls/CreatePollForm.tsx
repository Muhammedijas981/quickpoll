"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus, X } from "lucide-react";
import { pollsApi } from "@/lib/api";
import { usePollStore } from "@/store/pollStore";

export function CreatePollForm() {
  const router = useRouter();
  const { addPoll } = usePollStore();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const addOption = () => {
    setOptions([...options, ""]);
  };

  const removeOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!title.trim()) {
      setError("Please enter a poll title");
      return;
    }

    const validOptions = options.filter((opt) => opt.trim());
    if (validOptions.length < 2) {
      setError("Please provide at least 2 options");
      return;
    }

    setIsLoading(true);
    try {
      const newPoll = await pollsApi.createPoll({
        title: title.trim(),
        description: description.trim() || undefined,
        options: validOptions,
      });

      addPoll(newPoll);
      router.push(`/polls/${newPoll.id}`);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create poll");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Create a New Poll</CardTitle>
        <CardDescription>
          Ask a question and provide multiple options for people to vote on
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Poll Question *</Label>
            <Input
              id="title"
              placeholder="What's your question?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={200}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Input
              id="description"
              placeholder="Add more context to your poll"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={500}
            />
          </div>
          <div className="space-y-3">
            <Label>Poll Options *</Label>
            {options.map((option, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  placeholder={`Option ${index + 1}`}
                  value={option}
                  onChange={(e) => updateOption(index, e.target.value)}
                  maxLength={100}
                />
                {options.length > 2 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => removeOption(index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}

            {options.length < 10 && (
              <Button
                type="button"
                variant="outline"
                onClick={addOption}
                className="w-full gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Option
              </Button>
            )}
          </div>
          {error && <div className="text-sm text-destructive">{error}</div>}
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Creating..." : "Create Poll"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
