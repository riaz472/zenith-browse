
"use client";

import React from 'react';
import { X, Plus, Globe } from 'lucide-react';
import { BrowserTab } from './ZenithBrowser';
import { cn } from '@/lib/utils';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

interface TabStripProps {
  tabs: BrowserTab[];
  activeTabId: string;
  onSwitch: (id: string) => void;
  onClose: (id: string, e: React.MouseEvent) => void;
  onNewTab: () => void;
}

export default function TabStrip({ tabs, activeTabId, onSwitch, onClose, onNewTab }: TabStripProps) {
  return (
    <div className="bg-background/40 border-b border-white/5 flex items-center px-2 gap-1 overflow-hidden">
      <ScrollArea className="flex-1">
        <div className="flex items-center gap-1 h-10 px-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onSwitch(tab.id)}
              className={cn(
                "group relative flex items-center gap-2 px-3 py-1.5 min-w-[120px] max-w-[200px] rounded-t-lg transition-all duration-200 border-x border-t",
                activeTabId === tab.id 
                  ? "bg-[#07090D] border-white/10 text-primary" 
                  : "bg-transparent border-transparent text-muted-foreground hover:bg-white/5"
              )}
            >
              <Globe className={cn("h-3 w-3 shrink-0", activeTabId === tab.id ? "text-primary" : "text-muted-foreground")} />
              <span className="text-[11px] font-headline font-medium truncate flex-1 text-left">
                {tab.title}
              </span>
              <div 
                onClick={(e) => onClose(tab.id, e)}
                className="opacity-0 group-hover:opacity-100 p-0.5 rounded-full hover:bg-white/10 transition-all ml-1"
              >
                <X className="h-2.5 w-2.5" />
              </div>
              {activeTabId === tab.id && (
                <div className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-primary" />
              )}
            </button>
          ))}
        </div>
        <ScrollBar orientation="horizontal" className="hidden" />
      </ScrollArea>
      <button 
        onClick={onNewTab}
        className="p-1.5 rounded-md hover:bg-white/5 text-muted-foreground hover:text-white transition-all ml-2"
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}
