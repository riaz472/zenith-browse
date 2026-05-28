"use client";

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Layout, 
  Compass, 
  Info, 
  ShieldCheck, 
  ExternalLink, 
  Globe, 
  AlertCircle, 
  Search,
  Youtube,
  Github,
  Facebook,
  BookOpen,
  ArrowRight,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

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
  
  const urlObj = useMemo(() => {
    try {
      if (isInternal) return null;
      return new URL(currentUrl);
    } catch {
      return null;
    }
  }, [currentUrl, isInternal]);

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
          <p className="text-xs font-headline tracking-[0.3em] text-primary uppercase font-bold">Synchronizing Pipeline</p>
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
              <Compass className="h-3 w-3 animate-spin-slow" /> Zenith Core Engine v2.5.0
            </motion.div>
            
            <div className="space-y-2">
              <h1 className="text-7xl font-headline font-bold tracking-tighter text-white">
                ZENITH <span className="text-primary italic">BROWSE</span>
              </h1>
              <p className="text-muted-foreground text-xl font-light max-w-2xl mx-auto leading-relaxed">
                The next generation of intelligent web exploration. Performance, privacy, and precision unified.
              </p>
            </div>
          </header>

          <section className="space-y-6">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <h2 className="font-headline font-bold text-xs uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                <Zap className="h-3 w-3 text-accent" /> Speed Dial Hub
              </h2>
              <span className="text-[10px] font-medium text-white/30 uppercase tracking-widest">Optimized Routes</span>
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
              { title: 'AI Synthesis', icon: Layout, desc: 'Real-time contextual analysis of any digital target.' },
              { title: 'Privacy Shield', icon: ShieldCheck, desc: 'Zero-trust infrastructure with native encryption.' },
              { title: 'Canvas Engine', icon: Globe, desc: 'High-performance rendering with minimal latency.' },
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

          <footer className="pt-12 pb-8 text-center">
            <div className="flex items-center justify-center gap-6 opacity-30">
              <span className="text-[10px] font-headline font-bold uppercase tracking-widest">Powered by Gemini</span>
              <div className="h-1 w-1 rounded-full bg-white/20" />
              <span className="text-[10px] font-headline font-bold uppercase tracking-widest">Secured by Zenith</span>
              <div className="h-1 w-1 rounded-full bg-white/20" />
              <span className="text-[10px] font-headline font-bold uppercase tracking-widest">Engine v2.5.0</span>
            </div>
          </footer>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-white relative group">
      <div className="absolute top-0 left-0 right-0 bg-[#07090D]/90 backdrop-blur-md px-6 py-3 border-b border-white/5 flex items-center justify-between z-20 opacity-0 group-hover:opacity-100 transition-all duration-300">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-[10px] font-headline font-bold uppercase tracking-widest text-primary">
            <Globe className="h-3 w-3" /> Secure Virtual Environment
          </div>
          <div className="h-4 w-[1px] bg-white/10" />
          <span className="text-[10px] text-muted-foreground font-mono truncate max-w-sm">{currentUrl}</span>
        </div>
        <Button 
          variant="secondary" 
          size="sm" 
          onClick={() => window.open(currentUrl, '_blank')}
          className="bg-white text-black hover:bg-neutral-200 text-[10px] font-bold h-8 gap-2 px-4 rounded-full"
        >
          <ExternalLink className="h-3.5 w-3.5" /> Open Direct Access
        </Button>
      </div>
      
      <div className="w-full h-full bg-slate-50 flex flex-col items-center justify-center relative overflow-hidden">
        {/* Iframe for sites that allow it */}
        <iframe 
          src={currentUrl} 
          className="w-full h-full border-none z-10"
          title="Web View"
          sandbox="allow-scripts allow-same-origin allow-forms"
        />

        {/* Professional block notice overlay since most sites block iframing in this simulator */}
        <div className="absolute inset-0 z-20 bg-[#07090D] flex items-center justify-center p-8 pointer-events-auto">
          <div className="max-w-md w-full glass-dark p-10 rounded-[2.5rem] shadow-2xl space-y-8 text-center border-white/10">
             <div className="relative inline-block">
               <div className="h-20 w-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto border border-primary/20">
                 <ShieldCheck className="h-10 w-10 text-primary" />
               </div>
               <div className="absolute -top-2 -right-2 h-6 w-6 bg-accent rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(26,214,214,0.5)]">
                 <AlertCircle className="h-4 w-4 text-black" />
               </div>
             </div>
             
             <div className="space-y-3">
               <h3 className="text-2xl font-headline font-bold text-white tracking-tight italic">ENCRYPTED BOUNDARY</h3>
               <p className="text-sm text-gray-400 leading-relaxed font-light px-4">
                 <span className="text-primary font-bold">{urlObj?.hostname || 'Target Site'}</span> has security protocols that restrict embedded viewing within the browser canvas.
               </p>
             </div>

             <div className="space-y-3 pt-4">
               <Button 
                 variant="default" 
                 className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-14 rounded-2xl font-headline font-bold tracking-tight text-lg shadow-[0_0_20px_rgba(71,163,245,0.3)] transition-all active:scale-95"
                 onClick={() => window.open(currentUrl, '_blank')}
               >
                 Launch Live Target
                 <ArrowRight className="ml-2 h-5 w-5" />
               </Button>
               <Button 
                 variant="ghost" 
                 className="w-full text-muted-foreground hover:text-white hover:bg-white/5 font-headline font-bold text-xs uppercase tracking-widest"
                 onClick={() => onNavigate('zenith://welcome')}
               >
                 Return to Hub
               </Button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
