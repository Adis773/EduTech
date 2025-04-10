import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader2, SendHorizontal, MessageSquare } from "lucide-react";

export function AIAssistant() {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState<string | null>(null);
  const { toast } = useToast();

  const assistantMutation = useMutation({
    mutationFn: async (query: string) => {
      const res = await apiRequest("POST", "/api/ai/assistant", { query });
      return await res.json();
    },
    onSuccess: (data) => {
      setResponse(data.response);
      setQuery("");
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to get a response from the AI assistant",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    assistantMutation.mutate(query);
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-neutral-800 flex items-center">
            <MessageSquare className="h-6 w-6 mr-2 text-primary" />
            Ask AI Assistant
          </h2>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
            Powered by ChatGPT
          </span>
        </div>
        <p className="mt-1 text-sm text-neutral-500">
          Got questions? Need help with a topic? Your AI tutor is here to help!
        </p>
        
        {(response || assistantMutation.isPending) && (
          <div className="mt-4 p-4 bg-neutral-50 rounded-lg">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <MessageSquare className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                {assistantMutation.isPending ? (
                  <div className="flex items-center">
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    <p className="text-sm font-medium text-neutral-700">Thinking...</p>
                  </div>
                ) : (
                  <>
                    <p className="text-sm font-medium text-neutral-700">AI Assistant</p>
                    <p className="mt-1 text-sm text-neutral-500 whitespace-pre-line">{response}</p>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="mt-4">
          <div className="flex">
            <Input
              type="text"
              className="flex-1 focus:ring-primary focus:border-primary"
              placeholder="Type your question here..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              disabled={assistantMutation.isPending}
            />
            <Button 
              type="submit" 
              className="ml-3" 
              disabled={!query.trim() || assistantMutation.isPending}
            >
              {assistantMutation.isPending ? (
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
              ) : (
                <SendHorizontal className="h-5 w-5 mr-2" />
              )}
              Ask
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
