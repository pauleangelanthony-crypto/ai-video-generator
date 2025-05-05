"use client";

import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Textarea } from "./ui/textarea";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setFormData } from "@/lib/formSlice";
import type { RootState } from "@/lib/store";

interface FormData {
  prompt: string;
}

interface Message {
  type: "user" | "assistant";
  content: string;
}

export function ProposalGeneratorForm() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const dispatch = useDispatch();
  const formState = useSelector((state: RootState) => state.form);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const form = useForm<FormData>({
    defaultValues: {
      prompt: formState.prompt,
    },
  });

  const onSubmit = async (data: FormData) => {
    if (!formState.openaiApiKey) {
      toast.error("Please set your OpenAI API key in Settings first");
      return;
    }

    try {
      dispatch(setFormData(data));
      setIsGenerating(true);

      // Add user message to chat
      setMessages((prev) => [...prev, { type: "user", content: data.prompt }]);

      toast.info("Generating proposal...");

      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: data.prompt,
          model: formState.model,
          openaiApiKey: formState.openaiApiKey,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate proposal");
      }

      const result = await response.json();

      // Add assistant message to chat
      setMessages((prev) => [
        ...prev,
        { type: "assistant", content: result.proposal },
      ]);

      toast.success("Proposal generated successfully!");

      // Clear the textarea after successful submission
      form.setValue("prompt", "");
    } catch (error) {
      toast.error("Failed to generate proposal");
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
          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex-col gap-2 border-t pt-4"
        >
          <label className="text-sm font-medium">
            Job Description / Requirements
          </label>
          <div className="flex gap-4 space-y-2">
            <Textarea
              {...form.register("prompt", { required: true })}
              placeholder="Type your message here..."
              className="h-24 resize-none"
            />
            <Button type="submit" disabled={isGenerating} className="h-24">
              {isGenerating ? "Generating..." : "Send"}
            </Button>
          </div>
        </form>
      </div>
    </Card>
  );
}
