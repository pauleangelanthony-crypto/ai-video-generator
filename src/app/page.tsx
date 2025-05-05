import { ProposalGeneratorForm } from "@/components/ProposalGeneratorForm";

export default function Home() {
  return (
    <main className="bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-2xl">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold tracking-tight">
              AI Proposal Generator
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Generate amazing proposals using artificial intelligence. Just
              describe what you want to see!
            </p>
          </div>
          <ProposalGeneratorForm />
        </div>
      </div>
    </main>
  );
}
