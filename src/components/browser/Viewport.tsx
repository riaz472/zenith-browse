
"use client";

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Layout, Compass, Info, ShieldCheck, Search, ExternalLink, Sparkles, Globe, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ViewportProps {
  currentUrl: string;
  isLoading: boolean;
}

export default function Viewport({ currentUrl, isLoading }: ViewportProps) {
  const isInternal = currentUrl.startsWith('zenith://');
  
  const urlObj = useMemo(() => {
    try {
      if (isInternal) return null;
      return new URL(currentUrl);
    } catch {
      return null;
    }
  }, [currentUrl, isInternal]);

  const isGoogleSearch = useMemo(() => {
    return urlObj?.hostname === 'www.google.com' && urlObj?.pathname === '/search';
  }, [urlObj]);

  const isKnownBlocked = useMemo(() => {
    if (!urlObj) return false;
    const blockedHosts = [
      'www.google.com', 
      'google.com', 
      'github.com', 
      'www.github.com', 
      'facebook.com', 
      'www.facebook.com', 
      'twitter.com', 
      'x.com', 
      'www.linkedin.com',
      'linkedin.com',
      'instagram.com',
      'www.instagram.com'
    ];
    return blockedHosts.includes(urlObj.hostname);
  }, [urlObj]);

  if (isLoading) {
    return (
      <div className="flex-1 bg-background flex flex-col items-center justify-center space-y-4">
        <div className="relative h-1 w-64 bg-secondary rounded-full overflow-hidden">
          <motion.div 
            className="absolute inset-0 bg-primary"
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          />
        </div>
        <p className="text-xs font-headline tracking-widest text-muted-foreground uppercase">Decrypting Pipeline...</p>
      </div>
    );
  }

  // Specialized UI for Google Search results to handle iframe blocking elegantly
  if (isGoogleSearch) {
    const query = urlObj?.searchParams.get('q') || 'Search Query';
    return (
      <div className="flex-1 bg-background p-8 overflow-y-auto scrollbar-hide">
        <div className="max-w-3xl mx-auto space-y-10 py-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center text-center space-y-6"
          >
            <div className="h-20 w-20 rounded-3xl bg-primary/10 flex items-center justify-center border border-primary/20 shadow-[0_0_40px_rgba(71,163,245,0.1)]">
              <Search className="h-10 w-10 text-primary" />
            </div>
            <div className="space-y-2">
              <h2 className="text-4xl font-headline font-bold tracking-tight">External Search Ready</h2>
              <p className="text-muted-foreground text-lg max-w-lg mx-auto leading-relaxed">
                Zenith is ready to bridge your query to <span className="text-foreground font-semibold">Google Search Intelligence</span>.
              </p>
            </div>
            
            <div className="w-full max-w-md p-6 glass rounded-2xl border border-white/5 space-y-4">
              <div className="text-left">
                <p className="text-[10px] font-headline font-bold text-muted-foreground uppercase tracking-widest mb-1">Target Payload</p>
                <p className="text-sm font-medium truncate bg-white/5 px-3 py-2 rounded-lg border border-white/5">"{query}"</p>
              </div>
              <Button 
                className="w-full h-12 gap-3 bg-primary text-primary-foreground font-headline font-bold text-base shadow-[0_0_20px_rgba(71,163,245,0.2)] hover:scale-[1.02] transition-transform"
                onClick={() => window.open(currentUrl, '_blank')}
              >
                <Globe className="h-5 w-5" />
                Launch Live Results
              </Button>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-10">
            <div className="p-4 rounded-xl border border-white/5 bg-secondary/10 space-y-2">
              <ShieldCheck className="h-5 w-5 text-accent" />
              <h4 className="font-headline font-bold text-sm">Encrypted Bridge</h4>
              <p className="text-xs text-muted-foreground">Your search intent is protected within the Zenith environment.</p>
            </div>
            <div className="p-4 rounded-xl border border-white/5 bg-secondary/10 space-y-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <h4 className="font-headline font-bold text-sm">Neural Sync</h4>
              <p className="text-xs text-muted-foreground">AI Synthesis remains active for real-time analysis of target data.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isInternal && currentUrl.includes('welcome')) {
    return (
      <div className="flex-1 bg-background p-12 overflow-y-auto scrollbar-hide">
        <div className="max-w-4xl mx-auto space-y-12">
          <header className="space-y-4 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-primary text-xs font-headline font-bold uppercase tracking-wider">
              <Compass className="h-3 w-3" /> System Status: Operational
            </div>
            <h1 className="text-6xl font-headline font-bold tracking-tight bg-gradient-to-r from-white to-white/40 bg-clip-text text-transparent">
              Welcome to Zenith Browse
            </h1>
            <p className="text-muted-foreground text-xl font-light max-w-2xl mx-auto">
              Experience the web with intelligence and precision. Navigate seamlessly with Electric Speed.
            </p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { title: 'AI Synthesis', icon: Layout, desc: 'Real-time summarization of complex web architectures.' },
              { title: 'Canvas Core', icon: Info, desc: 'High-performance rendering engine with distraction-free layout.' },
              { title: 'Zero Trust', icon: ShieldCheck, desc: 'Advanced encryption and tracking prevention active.' },
              { title: 'Smart Hub', icon: Layout, desc: 'Context-aware navigation with predictive address hub.' },
            ].map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-6 rounded-2xl glass hover:border-primary/30 transition-all group"
              >
                <div className="h-12 w-12 rounded-xl bg-secondary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-headline font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>

          <div className="pt-8 text-center">
            <p className="text-xs text-muted-foreground font-headline uppercase tracking-widest opacity-50">
              Zenith Engine v2.5.0-Flash | Powered by Intelligence
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-white relative group">
      <div className="absolute top-0 left-0 right-0 bg-secondary/80 backdrop-blur-md px-4 py-2 border-b border-black/5 flex items-center justify-between z-20 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="flex items-center gap-2 text-[10px] font-headline font-bold uppercase tracking-wider text-muted-foreground">
          <Globe className="h-3 w-3" /> External Target Site
        </div>
        <Button 
          variant="secondary" 
          size="sm" 
          onClick={() => window.open(currentUrl, '_blank')}
          className="bg-black text-white hover:bg-neutral-800 text-[10px] h-7 gap-2"
        >
          <ExternalLink className="h-3 w-3" /> Open in New Tab
        </Button>
      </div>
      
      {!isKnownBlocked ? (
        <iframe 
          src={currentUrl} 
          className="w-full h-full border-none"
          title="Web View"
          sandbox="allow-scripts allow-same-origin allow-forms"
        />
      ) : null}
      
      {/* Fallback Overlay for known blocked sites */}
      <div className={cn(
        "absolute inset-0 flex items-center justify-center bg-slate-50/10 pointer-events-none group-hover:pointer-events-auto",
        isKnownBlocked ? "pointer-events-auto block" : "hidden"
      )}>
        <div className="max-w-md w-full mx-4 p-8 glass-dark rounded-3xl shadow-2xl space-y-6 text-center border-white/10">
           <div className="h-16 w-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
             <AlertCircle className="h-8 w-8 text-accent" />
           </div>
           <h3 className="text-xl font-headline font-bold text-white">Privacy Protection Active</h3>
           <p className="text-sm text-gray-400 leading-relaxed">
             The domain <span className="text-white font-mono font-semibold">{urlObj?.hostname}</span> restricts embedded views to ensure session security.
           </p>
           <Button 
             variant="default" 
             className="w-full bg-primary hover:bg-primary/90 h-12 font-headline font-bold tracking-tight"
             onClick={() => window.open(currentUrl, '_blank')}
           >
             Continue to Site Externally
           </Button>
        </div>
      </div>
    </div>
  );
}
