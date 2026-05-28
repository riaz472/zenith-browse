
"use client";

import React, { useState } from 'react';
import { Search, Shield, ArrowLeft, ArrowRight, RotateCcw, Sparkles, Globe, Share2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Share } from '@capacitor/share';

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

    // Basic URL detection
    const isUrl = /^(https?:\/\/)/.test(query) || 
                 (/^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+/.test(query) && !query.includes(' '));

    if (isUrl) {
      let url = query;
      if (!url.startsWith('http') && !url.includes('://')) {
        url = `https://${url}`;
      }
      onNavigate(url);
    } else {
      // Direct DuckDuckGo HTML for iframe compatibility
      onNavigate(`https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`);
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        title: 'Zenith Browse',
        text: 'Check out this site!',
        url: currentUrl,
        dialogTitle: 'Share this link',
      });
    } catch (err) {
      console.log('Sharing failed', err);
    }
  };

  React.useEffect(() => {
    setInputValue(currentUrl === 'zenith://welcome' ? '' : currentUrl);
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
            "w-full bg-secondary/30 border-white/5 pl-14 pr-10 py-1.5 h-10 transition-all focus:ring-primary focus:bg-secondary",
            isAiActive && "animate-micro-pulse border-accent/30"
          )}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Search or enter address"
        />
      </form>

      <div className="flex items-center gap-1">
        <Button onClick={handleShare} variant="ghost" size="icon" className="h-10 w-10 text-muted-foreground hover:text-foreground">
          <Share2 className="h-4 w-4" />
        </Button>
        <Button 
          onClick={onToggleAi}
          variant={isAiActive ? "default" : "outline"} 
          className={cn(
            "h-10 gap-2 font-headline font-semibold px-4 transition-all duration-500 hidden sm:flex",
            isAiActive ? "bg-accent text-accent-foreground border-accent" : "border-white/10"
          )}
        >
          <Sparkles className={cn("h-4 w-4", isAiActive && "animate-pulse")} />
          INSIGHT
        </Button>
      </div>
    </header>
  );
}
