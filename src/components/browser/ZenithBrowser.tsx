"use client";

import React, { useState, useEffect } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import AddressBar from './AddressBar';
import Viewport from './Viewport';
import SideNav from './SideNav';
import AIInsightPanel from './AIInsightPanel';
import { AnimatePresence, motion } from 'framer-motion';

export type BrowserPage = {
  url: string;
  title: string;
  content: string;
  timestamp: number;
};

export type Bookmark = {
  id: string;
  url: string;
  title: string;
  category: string;
  icon: string;
};

const INITIAL_URL = "zenith://welcome";

export default function ZenithBrowser() {
  const [currentUrl, setCurrentUrl] = useState(INITIAL_URL);
  const [history, setHistory] = useState<BrowserPage[]>([]);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([
    { id: '1', url: 'https://news.ycombinator.com', title: 'Hacker News', category: 'Tech', icon: 'Terminal' },
    { id: '2', url: 'https://vercel.com', title: 'Vercel', category: 'Dev', icon: 'Triangle' },
    { id: '3', url: 'https://openai.com', title: 'OpenAI', category: 'AI', icon: 'Cpu' },
    { id: '4', url: 'https://dribbble.com', title: 'Dribbble', category: 'Design', icon: 'Palette' },
  ]);
  const [isAiPanelOpen, setIsAiPanelOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigateTo = (url: string) => {
    if (!url || url.trim() === '') {
      url = INITIAL_URL;
    }
    
    setIsLoading(true);
    // Simulate loading delay for "Electric Speed" feel
    setTimeout(() => {
      setCurrentUrl(url);
      setIsLoading(false);
      // Add to history
      const newHistoryItem: BrowserPage = {
        url,
        title: url.startsWith('zenith://') ? 'Zenith Home' : url.replace(/(^\w+:|^)\/\//, ''),
        content: `Content for ${url}... This is simulated web content for the browser demo.`,
        timestamp: Date.now()
      };
      setHistory(prev => [newHistoryItem, ...prev.slice(0, 49)]);
    }, 600);
  };

  return (
    <SidebarProvider defaultOpen={false}>
      <div className="flex h-screen w-full bg-[#07090D] text-foreground overflow-hidden">
        <SideNav 
          onNavigate={navigateTo} 
          history={history} 
          bookmarks={bookmarks} 
          currentUrl={currentUrl}
        />
        
        <div className="flex-1 flex flex-col relative">
          <AddressBar 
            currentUrl={currentUrl} 
            onNavigate={navigateTo} 
            onToggleAi={() => setIsAiPanelOpen(!isAiPanelOpen)}
            isAiActive={isAiPanelOpen}
            isLoading={isLoading}
          />
          
          <div className="flex-1 flex overflow-hidden">
            <Viewport 
              currentUrl={currentUrl} 
              isLoading={isLoading} 
              onNavigate={navigateTo}
            />
            
            <AnimatePresence>
              {isAiPanelOpen && (
                <motion.div
                  initial={{ x: 400, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 400, opacity: 0 }}
                  transition={{ type: "spring", damping: 25, stiffness: 200 }}
                  className="w-[400px] border-l glass h-full z-20"
                >
                  <AIInsightPanel 
                    currentUrl={currentUrl} 
                    onClose={() => setIsAiPanelOpen(false)} 
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
