
"use client";

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Compass, 
  ShieldCheck, 
  Globe, 
  AlertCircle, 
  Youtube,
  Github,
  Facebook,
  BookOpen,
  ArrowRight,
  Zap,
  ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Browser } from '@capacitor/browser';

interface ViewportProps {
  currentUrl: string;
  isLoading: boolean;
  onNavigate: (url: string) => void;
}

const SPEED_DIAL = [
  { name: 'Google', url: 'https://www.google.com', icon: Globe, color: 'text-blue-400' },
  { name: 'YouTube', url: 'https://www.youtube.com', icon: Youtube, color: 'text-red-500' },
  { name: 'GitHub', url: 'https://www.github.com', icon: Github, color: 'text-white' },
  { name: 'Wikipedia', url: 'https://www.wikipedia.org', icon: BookOpen, color: 'text-slate-300' },
  { name: 'Facebook', url: 'https://www.facebook.com', icon: Facebook, color: 'text-blue-600' },
  { name: 'Hacker News', url: 'https://news.ycombinator.com', icon: Zap, color: 'text-orange-500' },
];

export default function Viewport({ currentUrl, isLoading, onNavigate }: ViewportProps) {
  const isInternal = currentUrl === 'zenith://welcome' || !currentUrl;
  const isSearch = currentUrl.includes('duckduckgo.com/html');
  
  const urlObj = useMemo(() => {
    try {
      if (isInternal) return null;
      return new URL(currentUrl);
    } catch {
      return null;
    }
  }, [currentUrl, isInternal]);

  const handleNativeLaunch = async () => {
    if (currentUrl) {
      await Browser.open({ url: currentUrl });
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 bg-[#07090D] flex flex-col items-center justify-center space-y-6">
        <div className="relative">
          <div className="h-24 w-24 rounded-2xl border border-primary/20 bg-primary/5 flex items-center justify-center animate-pulse">
            <Zap className="h-10 w-10 text-primary" />
          </div>
          <motion.div 
            className="absolute -inset-4 border border-accent/20 rounded-3xl"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
          />
        </div>
        <div className="text-center space-y-2">
          <p className="text-xs font-headline tracking-[0.3em] text-primary uppercase font-bold">Initializing Pipeline</p>
          <div className="h-1 w-48 bg-white/5 rounded-full overflow-hidden mx-auto">
            <motion.div 
              className="h-full bg-gradient-to-r from-primary to-accent"
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            />
          </div>
        </div>
      </div>
    );
  }

  if (isInternal) {
    return (
      <div className="flex-1 bg-[#07090D] p-8 md:p-16 overflow-y-auto scrollbar-hide">
        <div className="max-w-5xl mx-auto space-y-16">
          <header className="space-y-6 text-center pt-8">
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 bg-accent/10 border border-accent/20 rounded-full text-accent text-[10px] font-headline font-bold uppercase tracking-[0.2em]"
            >
              <Compass className="h-3 w-3 animate-spin-slow" /> Zenith Native Engine v3.0.0
            </motion.div>
            
            <div className="space-y-2">
              <h1 className="text-7xl font-headline font-bold tracking-tighter text-white">
                ZENITH <span className="text-primary italic">BROWSE</span>
              </h1>
              <p className="text-muted-foreground text-xl font-light max-w-2xl mx-auto leading-relaxed">
                The next generation of intelligent web exploration.
              </p>
            </div>
          </header>

          <section className="space-y-6">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <h2 className="font-headline font-bold text-xs uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                <Zap className="h-3 w-3 text-accent" /> Speed Dial Hub
              </h2>
              <span className="text-[10px] font-medium text-white/30 uppercase tracking-widest">Instant Connect</span>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {SPEED_DIAL.map((site, i) => (
                <motion.button
                  key={site.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => onNavigate(site.url)}
                  className="flex flex-col items-center gap-3 p-6 rounded-2xl glass hover:bg-white/5 hover:border-primary/40 transition-all group"
                >
                  <div className="h-14 w-14 rounded-xl bg-white/5 flex items-center justify-center group-hover:scale-110 group-hover:bg-primary/10 transition-all duration-300">
                    <site.icon className={cn("h-7 w-7", site.color)} />
                  </div>
                  <span className="text-xs font-headline font-semibold tracking-tight text-foreground/80 group-hover:text-white transition-colors">
                    {site.name}
                  </span>
                </motion.button>
              ))}
            </div>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: 'Native Shield', icon: Zap, desc: 'Advanced cross-process isolation for secure web rendering.' },
              { title: 'Neural Engine', icon: ShieldCheck, desc: 'AI-driven content synthesis and predictive navigation.' },
              { title: 'Hyper Flow', icon: Globe, desc: 'Low-latency data synchronization across native layers.' },
            ].map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                className="p-6 rounded-2xl border border-white/5 bg-gradient-to-br from-white/[0.02] to-transparent"
              >
                <feature.icon className="h-5 w-5 text-primary mb-4" />
                <h3 className="text-sm font-headline font-bold mb-2 uppercase tracking-widest">{feature.title}</h3>
                <p className="text-muted-foreground text-xs leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Use iframe for Search Results (DuckDuckGo HTML is generally iframe-friendly)
  if (isSearch) {
    return (
      <div className="flex-1 bg-white relative">
        <iframe 
          src={currentUrl} 
          className="w-full h-full border-none"
          title="Search Results"
        />
        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-[#07090D] flex items-center justify-center z-50">
             <Zap className="h-10 w-10 text-primary animate-pulse" />
          </div>
        )}
      </div>
    );
  }

  // Fallback for External Sites that block iframes
  return (
    <div className="flex-1 bg-[#07090D] flex items-center justify-center p-8">
      <div className="max-w-md w-full glass-dark p-10 rounded-[2.5rem] shadow-2xl space-y-8 text-center border-white/10 relative overflow-hidden">
         <div className="absolute -top-24 -right-24 h-48 w-48 bg-primary/20 blur-[80px] rounded-full" />
         <div className="absolute -bottom-24 -left-24 h-48 w-48 bg-accent/20 blur-[80px] rounded-full" />

         <div className="relative inline-block">
           <div className="h-20 w-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto border border-primary/20">
             <ShieldCheck className="h-10 w-10 text-primary" />
           </div>
           <div className="absolute -top-2 -right-2 h-6 w-6 bg-accent rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(26,214,214,0.5)]">
             <AlertCircle className="h-4 w-4 text-black" />
           </div>
         </div>
         
         <div className="space-y-3 relative z-10">
           <h3 className="text-2xl font-headline font-bold text-white tracking-tight italic uppercase">Native Secure Port</h3>
           <p className="text-sm text-gray-400 leading-relaxed font-light px-4">
             Zenith is preparing a native system bridge to launch <span className="text-primary font-bold">{urlObj?.hostname || 'Target Site'}</span>. This bypasses web security headers.
           </p>
         </div>

         <div className="space-y-3 pt-4 relative z-10">
           <Button 
             variant="default" 
             className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-14 rounded-2xl font-headline font-bold tracking-tight text-lg shadow-[0_0_20px_rgba(71,163,245,0.3)] transition-all active:scale-95"
             onClick={handleNativeLaunch}
           >
             Launch Secure Port
             <ArrowRight className="ml-2 h-5 w-5" />
           </Button>
           <div className="flex gap-2">
             <Button 
               variant="ghost" 
               className="flex-1 text-muted-foreground hover:text-white hover:bg-white/5 font-headline font-bold text-[10px] uppercase tracking-widest h-10"
               onClick={() => onNavigate('zenith://welcome')}
             >
               Home Hub
             </Button>
             <Button 
               variant="ghost" 
               className="flex-1 text-muted-foreground hover:text-white hover:bg-white/5 font-headline font-bold text-[10px] uppercase tracking-widest h-10 gap-2"
               onClick={() => window.open(currentUrl, '_blank')}
             >
               <ExternalLink className="h-3 w-3" /> External
             </Button>
           </div>
         </div>
      </div>
    </div>
  );
}
