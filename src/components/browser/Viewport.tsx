
"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Layout, Compass, Info, ShieldCheck } from 'lucide-react';

interface ViewportProps {
  currentUrl: string;
  isLoading: boolean;
}

export default function Viewport({ currentUrl, isLoading }: ViewportProps) {
  const isInternal = currentUrl.startsWith('zenith://');

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

  if (isInternal) {
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
    <div className="flex-1 bg-white relative">
      <iframe 
        src={currentUrl} 
        className="w-full h-full border-none"
        title="Web View"
        sandbox="allow-scripts allow-same-origin allow-forms"
      />
      <div className="absolute inset-0 pointer-events-none border-t border-black/5" />
    </div>
  );
}
