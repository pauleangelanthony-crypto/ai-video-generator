"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { toast } from "sonner";
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

interface FormData {
  prompt: string;
  model: string;
  openaiApiKey: string;
}

interface GeneratedProposal {
  proposal: string;
}

interface Message {
  type: "user" | "assistant";
  content: string;
}

const MODELS = [
  { id: "gpt-image-1", name: "GPT Image 1" },
  { id: "gpt-4.1-nano", name: "GPT-4.1 Nano" },
  { id: "gpt-4.1-nano-2025-04-14", name: "GPT-4.1 Nano (2025-04-14)" },
  { id: "gpt-4.1-mini", name: "GPT-4.1 Mini" },
  { id: "gpt-4.1-mini-2025-04-14", name: "GPT-4.1 Mini (2025-04-14)" },
  { id: "gpt-4.1", name: "GPT-4.1" },
  { id: "gpt-4.1-2025-04-14", name: "GPT-4.1 (2025-04-14)" },
  { id: "gpt-4o-mini-tts", name: "GPT-4o Mini TTS" },
  { id: "gpt-4o-mini-transcribe", name: "GPT-4o Mini Transcribe" },
  { id: "gpt-4o-transcribe", name: "GPT-4o Transcribe" },
  { id: "gpt-4o-mini-search-preview", name: "GPT-4o Mini Search Preview" },
  {
    id: "gpt-4o-mini-search-preview-2025-03-11",
    name: "GPT-4o Mini Search Preview (2025-03-11)",
  },
  { id: "gpt-4o-search-preview", name: "GPT-4o Search Preview" },
  {
    id: "gpt-4o-search-preview-2025-03-11",
    name: "GPT-4o Search Preview (2025-03-11)",
  },
  { id: "gpt-4.5-preview-2025-02-27", name: "GPT-4.5 Preview (2025-02-27)" },
  { id: "gpt-4.5-preview", name: "GPT-4.5 Preview" },
  { id: "gpt-4o-2024-11-20", name: "GPT-4o (2024-11-20)" },
  { id: "gpt-4o-mini-audio-preview", name: "GPT-4o Mini Audio Preview" },
  { id: "gpt-4o-mini-realtime-preview", name: "GPT-4o Mini Realtime Preview" },
  {
    id: "gpt-4o-mini-audio-preview-2024-12-17",
    name: "GPT-4o Mini Audio Preview (2024-12-17)",
  },
  {
    id: "gpt-4o-mini-realtime-preview-2024-12-17",
    name: "GPT-4o Mini Realtime Preview (2024-12-17)",
  },
  {
    id: "gpt-4o-audio-preview-2024-12-17",
    name: "GPT-4o Audio Preview (2024-12-17)",
  },
  {
    id: "gpt-4o-realtime-preview-2024-12-17",
    name: "GPT-4o Realtime Preview (2024-12-17)",
  },
  { id: "gpt-4o-realtime-preview", name: "GPT-4o Realtime Preview" },
  { id: "gpt-4o-audio-preview", name: "GPT-4o Audio Preview" },
  {
    id: "gpt-4o-audio-preview-2024-10-01",
    name: "GPT-4o Audio Preview (2024-10-01)",
  },
  {
    id: "gpt-4o-realtime-preview-2024-10-01",
    name: "GPT-4o Realtime Preview (2024-10-01)",
  },
  { id: "gpt-4o-2024-08-06", name: "GPT-4o (2024-08-06)" },
  { id: "gpt-4o-mini", name: "GPT-4o Mini" },
  { id: "gpt-4o-mini-2024-07-18", name: "GPT-4o Mini (2024-07-18)" },
  { id: "gpt-4o-2024-05-13", name: "GPT-4o (2024-05-13)" },
  { id: "gpt-4o", name: "GPT-4o" },
  { id: "gpt-4-turbo-2024-04-09", name: "GPT-4 Turbo (2024-04-09)" },
  { id: "gpt-4-turbo", name: "GPT-4 Turbo" },
  { id: "gpt-3.5-turbo-0125", name: "GPT-3.5 Turbo (0125)" },
  { id: "gpt-4-turbo-preview", name: "GPT-4 Turbo Preview" },
  { id: "gpt-4-0125-preview", name: "GPT-4 (0125 Preview)" },
  { id: "gpt-3.5-turbo-1106", name: "GPT-3.5 Turbo (1106)" },
  { id: "gpt-4-1106-preview", name: "GPT-4 (1106 Preview)" },
  { id: "gpt-3.5-turbo-instruct-0914", name: "GPT-3.5 Turbo Instruct (0914)" },
  { id: "gpt-3.5-turbo-instruct", name: "GPT-3.5 Turbo Instruct" },
  { id: "gpt-4-32k-0314", name: "GPT-4 32K (0314)" },
  { id: "gpt-4", name: "GPT-4" },
  { id: "gpt-4-0314", name: "GPT-4 (0314)" },
  { id: "gpt-4-0613", name: "GPT-4 (0613)" },
  { id: "gpt-3.5-turbo-16k", name: "GPT-3.5 Turbo 16K" },
  { id: "gpt-3.5-turbo", name: "GPT-3.5 Turbo" },
];

export function ProposalGeneratorForm() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedProposal, setGeneratedProposal] =
    useState<GeneratedProposal | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [status, setStatus] = useState<string>("");
  const dispatch = useDispatch();
  const formState = useSelector((state: RootState) => state.form) as FormData;

  const form = useForm<FormData>({
    defaultValues: {
      prompt: formState.prompt,
      model: formState.model || "gpt-4o-mini",
      openaiApiKey: formState.openaiApiKey,
    },
  });

  const selectedModel = MODELS.find((m) => m.id === form.watch("model"));

  const onSubmit = async (data: FormData) => {
    try {
      dispatch(setFormData(data));
      setIsGenerating(true);
      setStatus("Initializing proposal generation...");

      // Add user message to chat
      setMessages((prev) => [...prev, { type: "user", content: data.prompt }]);

      toast.info(`Generating proposal with ${selectedModel?.name}`);

      setStatus("Sending request to AI model...");
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to generate proposal");
      }

      setStatus("Processing response...");
      const result = await response.json();
      setGeneratedProposal(result);

      // Add assistant message to chat
      setMessages((prev) => [
        ...prev,
        { type: "assistant", content: result.proposal },
      ]);

      setStatus("Proposal generated successfully!");
      toast.success("Proposal generated successfully!");

      // Clear the textarea after successful submission
      form.setValue("prompt", "");
    } catch (error) {
      setStatus("Error generating proposal");
      toast.error("Failed to generate proposal:");
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="flex flex-col h-[600px]">
        {/* Chat Messages Area */}
        <div className="flex-1 overflow-y-auto mb-4 space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.type === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-4 ${
                  message.type === "user"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-900"
                }`}
              >
                <pre className="whitespace-pre-wrap text-sm">
                  {message.content}
                </pre>
              </div>
            </div>
          ))}
          {isGenerating && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-lg p-4">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Form */}
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 border-t pt-4"
        >
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Job Description / Requirements
            </label>
            <Textarea
              {...form.register("prompt", { required: true })}
              placeholder="Type your message here..."
              className="h-24 resize-none"
            />
          </div>

          <div className="flex justify-between items-center">
            <Select
              onValueChange={(value) => {
                form.setValue("model", value);
              }}
              defaultValue={form.getValues("model")}
            >
              <SelectTrigger className="w-[200px]">
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

            <Button type="submit" disabled={isGenerating}>
              {isGenerating ? "Generating..." : "Send"}
            </Button>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">OpenAI API Key</label>
            <Input
              type="password"
              {...form.register("openaiApiKey", { required: true })}
              placeholder="Enter your OpenAI API key"
            />
          </div>
        </form>
      </div>
    </Card>
  );
}
