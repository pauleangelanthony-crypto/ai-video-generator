"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import { Github } from "lucide-react";

export function Header() {
  return (
    <header className="border-b container mx-auto flex h-16 items-center justify-between px-4">
      <Link href="/" className="flex items-center space-x-2">
        <span className="text-2xl font-bold">AI Proposal Generator</span>
      </Link>
      <nav className="flex items-center space-x-4">
        <Button asChild variant="ghost">
          <Link href="/">Home</Link>
        </Button>
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
