
"use client";

import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  LayoutGrid, 
  Settings, 
  Plus, 
  Terminal, 
  Cpu, 
  Triangle, 
  Palette,
  ChevronRight,
  Bookmark as BookmarkIcon,
  Search
} from 'lucide-react';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarGroup, SidebarGroupLabel, SidebarGroupContent } from '@/components/ui/sidebar';
import { BrowserPage, Bookmark } from './ZenithBrowser';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';

interface SideNavProps {
  onNavigate: (url: string) => void;
  history: BrowserPage[];
  bookmarks: Bookmark[];
  currentUrl: string;
}

const IconMap: any = {
  Terminal,
  Cpu,
  Triangle,
  Palette
};

function HistoryItem({ item, onNavigate }: { item: BrowserPage, onNavigate: (url: string) => void }) {
  const [formattedTime, setFormattedTime] = useState<string>('');

  useEffect(() => {
    // Prevent hydration mismatch by generating time only on the client
    setFormattedTime(new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  }, [item.timestamp]);

  return (
    <SidebarMenuItem>
      <SidebarMenuButton 
        onClick={() => onNavigate(item.url)}
        className="h-auto py-2.5 flex flex-col items-start gap-0.5"
      >
        <div className="flex items-center gap-2 w-full">
          <Clock className="h-3 w-3 text-primary shrink-0" />
          <span className="truncate text-sm font-medium">{item.title || item.url}</span>
        </div>
        <span className="truncate text-[10px] text-muted-foreground ml-5 opacity-60 group-data-[collapsible=icon]:hidden">
          {formattedTime || '...'}
        </span>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

export default function SideNav({ onNavigate, history, bookmarks, currentUrl }: SideNavProps) {
  const [activeTab, setActiveTab] = useState<'collections' | 'history'>('collections');

  return (
    <Sidebar collapsible="icon" className="border-r border-white/5 bg-[#0E1216]">
      <SidebarHeader className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-2 group cursor-pointer" onClick={() => onNavigate('zenith://welcome')}>
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-[0_0_15px_rgba(71,163,245,0.4)]">
            <span className="font-headline font-bold text-white text-lg">Z</span>
          </div>
          <span className="font-headline font-bold tracking-tight text-xl group-data-[collapsible=icon]:hidden">ZENITH</span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <div className="px-4 py-2 group-data-[collapsible=icon]:hidden">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
            <Input 
              placeholder="Search..." 
              className="pl-8 bg-secondary/30 border-white/5 h-9 text-xs focus:ring-accent/50"
            />
          </div>
        </div>

        <div className="px-2 py-2 group-data-[collapsible=icon]:hidden flex gap-1">
          <button 
            onClick={() => setActiveTab('collections')}
            className={cn(
              "flex-1 py-1.5 px-3 rounded-md text-[10px] font-headline font-bold uppercase tracking-wider transition-all",
              activeTab === 'collections' ? "bg-secondary text-accent" : "text-muted-foreground hover:bg-secondary/50"
            )}
          >
            Collections
          </button>
          <button 
            onClick={() => setActiveTab('history')}
            className={cn(
              "flex-1 py-1.5 px-3 rounded-md text-[10px] font-headline font-bold uppercase tracking-wider transition-all",
              activeTab === 'history' ? "bg-secondary text-primary" : "text-muted-foreground hover:bg-secondary/50"
            )}
          >
            Timeline
          </button>
        </div>

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {activeTab === 'collections' ? (
                <>
                  <SidebarGroupLabel className="px-4 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-1 group-data-[collapsible=icon]:hidden">
                    SMART COLLECTIONS
                  </SidebarGroupLabel>
                  {bookmarks.map(bookmark => {
                    const IconComp = IconMap[bookmark.icon] || BookmarkIcon;
                    return (
                      <SidebarMenuItem key={bookmark.id}>
                        <SidebarMenuButton 
                          onClick={() => onNavigate(bookmark.url)}
                          isActive={currentUrl === bookmark.url}
                          className="hover:bg-accent/10 hover:text-accent transition-colors py-6"
                        >
                          <IconComp className="h-4 w-4" />
                          <span className="font-medium">{bookmark.title}</span>
                          <span className="ml-auto text-[10px] opacity-40 font-headline uppercase group-data-[collapsible=icon]:hidden">{bookmark.category}</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    )
                  })}
                  <SidebarMenuItem className="mt-4">
                    <SidebarMenuButton className="border border-dashed border-white/10 text-muted-foreground hover:border-accent hover:text-accent">
                      <Plus className="h-4 w-4" />
                      <span>Create Hub</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </>
              ) : (
                <>
                  <SidebarGroupLabel className="px-4 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-1 group-data-[collapsible=icon]:hidden">
                    NAVIGATION TIMELINE
                  </SidebarGroupLabel>
                  {history.length > 0 ? (
                    history.map((item, idx) => (
                      <HistoryItem key={`${item.url}-${idx}`} item={item} onNavigate={onNavigate} />
                    ))
                  ) : (
                    <div className="px-4 py-8 text-center group-data-[collapsible=icon]:hidden">
                      <Clock className="h-8 w-8 text-muted mx-auto mb-2 opacity-20" />
                      <p className="text-xs text-muted-foreground">Timeline is clear.</p>
                    </div>
                  )}
                </>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-white/5">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="hover:text-primary transition-colors">
              <Settings className="h-4 w-4" />
              <span>Engine Config</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
