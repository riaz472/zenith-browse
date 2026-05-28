
"use client";

import React, { useState, useEffect } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import AddressBar from './AddressBar';
import Viewport from './Viewport';
import SideNav from './SideNav';
import TabStrip from './TabStrip';
import AIInsightPanel from './AIInsightPanel';
import { AnimatePresence, motion } from 'framer-motion';
import { Preferences } from '@capacitor/preferences';

export type BrowserPage = {
  url: string;
  title: string;
  timestamp: number;
};

export type Bookmark = {
  id: string;
  url: string;
  title: string;
  category: string;
  icon: string;
};

export type BrowserTab = {
  id: string;
  url: string;
  title: string;
  isLoading: boolean;
};

const INITIAL_URL = "zenith://welcome";

export default function ZenithBrowser() {
  const [tabs, setTabs] = useState<BrowserTab[]>([
    { id: 'initial-tab', url: INITIAL_URL, title: 'Zenith Home', isLoading: false }
  ]);
  const [activeTabId, setActiveTabId] = useState('initial-tab');
  const [history, setHistory] = useState<BrowserPage[]>([]);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [isAiPanelOpen, setIsAiPanelOpen] = useState(false);

  const activeTab = tabs.find(t => t.id === activeTabId) || tabs[0];

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    const histData = await Preferences.get({ key: 'browser_history' });
    const bookData = await Preferences.get({ key: 'browser_bookmarks' });
    
    if (histData.value) setHistory(JSON.parse(histData.value));
    if (bookData.value) {
      setBookmarks(JSON.parse(bookData.value));
    } else {
      const defaults = [
        { id: '1', url: 'https://news.ycombinator.com', title: 'Hacker News', category: 'Tech', icon: 'Terminal' },
        { id: '2', url: 'https://vercel.com', title: 'Vercel', category: 'Dev', icon: 'Triangle' },
        { id: '3', url: 'https://openai.com', title: 'OpenAI', category: 'AI', icon: 'Cpu' },
        { id: '4', url: 'https://dribbble.com', title: 'Dribbble', category: 'Design', icon: 'Palette' },
      ];
      setBookmarks(defaults);
      await Preferences.set({ key: 'browser_bookmarks', value: JSON.stringify(defaults) });
    }
  };

  const saveHistory = async (newHistory: BrowserPage[]) => {
    await Preferences.set({ key: 'browser_history', value: JSON.stringify(newHistory) });
  };

  const navigateTo = (url: string) => {
    const finalUrl = (!url || url.trim() === '') ? INITIAL_URL : url;

    // We do NOT use Browser.open here anymore. 
    // All navigation updates the Viewport, which handles the rendering strategy.
    setTabs(prev => prev.map(tab => 
      tab.id === activeTabId 
        ? { ...tab, url: finalUrl, isLoading: true, title: finalUrl.startsWith('zenith://') ? 'Zenith Home' : finalUrl } 
        : tab
    ));

    // Simulation of network request
    setTimeout(() => {
      setTabs(prev => prev.map(tab => 
        tab.id === activeTabId ? { ...tab, isLoading: false } : tab
      ));

      const newHistoryItem: BrowserPage = {
        url: finalUrl,
        title: finalUrl.startsWith('zenith://') ? 'Zenith Home' : finalUrl.replace(/(^\w+:|^)\/\//, ''),
        timestamp: Date.now()
      };
      
      setHistory(prev => {
        const updated = [newHistoryItem, ...prev.slice(0, 99)];
        saveHistory(updated);
        return updated;
      });
    }, 400);
  };

  const openNewTab = (url: string = INITIAL_URL) => {
    const newId = Math.random().toString(36).substring(7);
    const newTab: BrowserTab = {
      id: newId,
      url,
      title: 'New Tab',
      isLoading: false
    };
    setTabs(prev => [...prev, newTab]);
    setActiveTabId(newId);
  };

  const closeTab = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (tabs.length === 1) return;
    
    setTabs(prev => {
      const filtered = prev.filter(t => t.id !== id);
      if (activeTabId === id) {
        setActiveTabId(filtered[0].id);
      }
      return filtered;
    });
  };

  return (
    <SidebarProvider defaultOpen={false}>
      <div className="flex h-screen w-full bg-[#07090D] text-foreground overflow-hidden">
        <SideNav 
          onNavigate={navigateTo} 
          history={history} 
          bookmarks={bookmarks} 
          currentUrl={activeTab.url}
        />
        
        <div className="flex-1 flex flex-col relative">
          <AddressBar 
            currentUrl={activeTab.url} 
            onNavigate={navigateTo} 
            onToggleAi={() => setIsAiPanelOpen(!isAiPanelOpen)}
            isAiActive={isAiPanelOpen}
            isLoading={activeTab.isLoading}
          />
          
          <TabStrip 
            tabs={tabs} 
            activeTabId={activeTabId} 
            onSwitch={setActiveTabId} 
            onClose={closeTab} 
            onNewTab={openNewTab} 
          />
          
          <div className="flex-1 flex overflow-hidden">
            <Viewport 
              currentUrl={activeTab.url} 
              isLoading={activeTab.isLoading} 
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
                    currentUrl={activeTab.url} 
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
