
"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Layout, Compass, Info, ShieldCheck, Search, ExternalLink, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ViewportProps {
  currentUrl: string;
  isLoading: boolean;
}

export default function Viewport({ currentUrl, isLoading }: ViewportProps) {
  const isInternal = currentUrl.startsWith('zenith://');
  const isSearch = currentUrl.startsWith('zenith://search');

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

  if (isSearch) {
    const urlParams = new URLSearchParams(currentUrl.split('?')[1]);
    const query = urlParams.get('q') || '';

    return (
      <div className="flex-1 bg-background p-8 overflow-y-auto scrollbar-hide">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="flex items-center gap-3 border-b border-white/5 pb-6">
            <div className="h-10 w-10 rounded-full bg-accent/20 flex items-center justify-center">
              <Search className="h-5 w-5 text-accent" />
            </div>
            <div>
              <h2 className="text-2xl font-headline font-bold">Search Results</h2>
              <p className="text-muted-foreground text-sm">Zenith Intelligence synthesis for "{query}"</p>
            </div>
          </div>

          <div className="space-y-6">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 rounded-2xl bg-accent/5 border border-accent/20 space-y-3"
            >
              <div className="flex items-center gap-2 text-accent text-xs font-bold uppercase tracking-widest">
                <Sparkles className="h-3 w-3" /> AI Quick Answer
              </div>
              <p className="text-foreground/90 leading-relaxed">
                Searching for <strong>{query}</strong> across the global neural web. Zenith AI suggests that this topic relates to high-performance computing and user-centric digital transformation. 
                {query.toLowerCase().includes('translate') ? " Google Translate is a multilingual neural machine translation service developed by Google, to translate text, documents and websites from one language into another." : " Zenith is currently synthesizing deeper insights for this specific query."}
              </p>
            </motion.div>

            {[1, 2, 3, 4].map((i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="group cursor-pointer space-y-1"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">https://zenith-results.io/{query.replace(/\s+/g, '-').toLowerCase()}/{i}</span>
                </div>
                <h3 className="text-xl font-headline font-semibold text-primary group-hover:underline">
                  Exploring {query} - Deep Dive Analysis Part {i}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  Discover the latest trends and architectural shifts in {query}. Our engine has mapped the most relevant nodes to provide a comprehensive overview for Zenith users.
                </p>
              </motion.div>
            ))}
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
      <iframe 
        src={currentUrl} 
        className="w-full h-full border-none"
        title="Web View"
        sandbox="allow-scripts allow-same-origin allow-forms"
      />
      <div className="absolute inset-0 pointer-events-none border-t border-black/5" />
      
      {/* Overlay to handle potential iframe failures gracefully */}
      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button 
          variant="secondary" 
          size="sm" 
          onClick={() => window.open(currentUrl, '_blank')}
          className="bg-white shadow-lg border-white/20 text-black hover:bg-neutral-100"
        >
          <ExternalLink className="h-3 w-3 mr-2" /> Open in New Tab
        </Button>
      </div>
    </div>
  );
}
