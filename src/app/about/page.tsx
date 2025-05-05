"use client";

import { Header } from "@/components/Header";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

interface GeneratedProposal {
  id: string;
  url: string;
  prompt: string;
  createdAt: string;
}

export default function AboutPage() {
  const [proposals, setProposals] = useState<GeneratedProposal[]>([]);

  useEffect(() => {
    // Load images from localStorage on component mount
    const savedProposals = localStorage.getItem("generatedProposals");
    if (savedProposals) {
      setProposals(JSON.parse(savedProposals));
    }
  }, []);

  const handleClearGallery = () => {
    if (
      window.confirm(
        "Are you sure you want to delete all images? This cannot be undone."
      )
    ) {
      localStorage.removeItem("generatedProposals");
      setProposals([]);
      toast.success("Proposals cleared successfully");
    }
  };

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">About</h1>
            <p className="mt-4 text-lg text-muted-foreground">
              This is a simple tool that allows you to generate proposals using
              artificial intelligence.
            </p>
          </div>
          <Button
            variant="destructive"
            onClick={handleClearGallery}
            className="flex items-center gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Clear Gallery
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {proposals.map((proposal) => (
            <Card key={proposal.id} className="overflow-hidden">
              <Image
                src={proposal.url}
                alt={proposal.prompt}
                width={512}
                height={512}
                className="aspect-square w-full object-cover"
                unoptimized
              />
              <div className="p-4">
                <p className="text-sm text-muted-foreground">
                  {proposal.prompt}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Generated on {proposal.createdAt}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}
