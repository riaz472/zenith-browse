
"use client";

import React, { useState } from 'react';
import { Search, Shield, ArrowLeft, ArrowRight, RotateCcw, Sparkles, Globe } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface AddressBarProps {
  currentUrl: string;
  onNavigate: (url: string) => void;
  onToggleAi: () => void;
  isAiActive: boolean;
  isLoading: boolean;
}

export default function AddressBar({ currentUrl, onNavigate, onToggleAi, isAiActive, isLoading }: AddressBarProps) {
  const [inputValue, setInputValue] = useState(currentUrl);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = inputValue.trim();
    if (!query) return;

    // Basic URL detection: starts with protocol or has a TLD-like structure with no spaces
    const isUrl = /^(https?:\/\/)/.test(query) || 
                 (/^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+/.test(query) && !query.includes(' '));

    if (isUrl) {
      let url = query;
      if (!url.startsWith('http') && !url.includes('://')) {
        url = `https://${url}`;
      }
      onNavigate(url);
    } else {
      // Treat as search query - Now automatically redirecting to live Google Search
      onNavigate(`https://www.google.com/search?q=${encodeURIComponent(query)}`);
    }
  };

  React.useEffect(() => {
    // Sync input with the actual URL when it changes externally
    setInputValue(currentUrl);
  }, [currentUrl]);

  return (
    <header className="p-3 border-b glass flex items-center gap-3 z-30">
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
          <ArrowRight className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
          <RotateCcw className={cn("h-4 w-4", isLoading && "animate-spin")} />
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 relative group">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none text-muted-foreground">
          {inputValue.startsWith('http') ? (
            <Globe className="h-3.5 w-3.5 text-accent" />
          ) : (
            <Shield className="h-3.5 w-3.5 text-primary" />
          )}
          <Search className="h-4 w-4" />
        </div>
        <Input 
          className={cn(
            "w-full bg-secondary/50 border-white/5 pl-14 pr-10 py-1.5 h-10 transition-all focus:ring-primary focus:bg-secondary",
            isAiActive && "animate-micro-pulse border-accent/30 shadow-[0_0_15px_rgba(26,214,214,0.1)]"
          )}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Enter URL or Search Zenith..."
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 pointer-events-none">
          <span className="text-[10px] font-headline font-bold uppercase tracking-widest text-muted-foreground/50 border border-white/10 rounded px-1.5 py-0.5">SECURE</span>
        </div>
      </form>

      <Button 
        onClick={onToggleAi}
        variant={isAiActive ? "default" : "outline"} 
        className={cn(
          "h-10 gap-2 font-headline font-semibold px-4 transition-all duration-500",
          isAiActive ? "bg-accent text-accent-foreground border-accent shadow-[0_0_20px_rgba(26,214,214,0.3)] hover:bg-accent/90" : "border-white/10 hover:border-primary/50"
        )}
      >
        <Sparkles className={cn("h-4 w-4", isAiActive && "animate-pulse")} />
        AI INSIGHT
      </Button>
    </header>
  );
}
