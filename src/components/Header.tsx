"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import { Github, Settings } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useDispatch, useSelector } from "react-redux";
import { setFormData } from "@/lib/formSlice";
import type { RootState } from "@/lib/store";

const MODELS = [
  { id: "gpt-4o-mini", name: "GPT-4o Mini" },
  { id: "gpt-4o", name: "GPT-4o" },
  { id: "gpt-4-turbo", name: "GPT-4 Turbo" },
  { id: "gpt-3.5-turbo", name: "GPT-3.5 Turbo" },
];

export function Header() {
  const dispatch = useDispatch();
  const formState = useSelector((state: RootState) => state.form);

  const handleModelChange = (value: string) => {
    dispatch(setFormData({ model: value }));
  };

  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setFormData({ openaiApiKey: e.target.value }));
  };

  return (
    <header className="border-b container mx-auto flex h-16 items-center justify-between px-4">
      <Link href="/" className="flex items-center space-x-2">
        <span className="text-2xl font-bold">AI Proposal Generator</span>
      </Link>
      <nav className="flex items-center space-x-4">
        <Button asChild variant="ghost">
          <Link href="/">Home</Link>
        </Button>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Settings</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Model</label>
                <Select
                  defaultValue={formState.model}
                  onValueChange={handleModelChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a model" />
                  </SelectTrigger>
                  <SelectContent>
                    {MODELS.map((model) => (
                      <SelectItem key={model.id} value={model.id}>
                        {model.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">OpenAI API Key</label>
                <Input
                  type="password"
                  value={formState.openaiApiKey}
                  onChange={handleApiKeyChange}
                  placeholder="Enter your OpenAI API key"
                />
              </div>
            </div>
          </DialogContent>
        </Dialog>
        <Button asChild variant="ghost" size="icon">
          <Link
            href="https://github.com/jupiter221208/ai-proposal-generator"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Github className="h-5 w-5" />
          </Link>
        </Button>
      </nav>
    </header>
  );
}
