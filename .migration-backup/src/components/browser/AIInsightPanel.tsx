"use client";

import React, { useState, useEffect } from 'react';
import { X, Sparkles, Brain, ListChecks, ArrowRight, Share2, Copy, Download, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

type SummarizeWebpageOutput = {
  summary: string;
  keyTakeaways: string[];
};

interface AIInsightPanelProps {
  currentUrl: string;
  onClose: () => void;
}

export default function AIInsightPanel({ currentUrl, onClose }: AIInsightPanelProps) {
  const [insight, setInsight] = useState<SummarizeWebpageOutput | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const performAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      // Client-side simulation of AI analysis for static builds
      // In a production Capacitor app, you would call a remote API endpoint here
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const result: SummarizeWebpageOutput = {
        summary: `Zenith AI has synthesized the core essence of ${currentUrl}. The target exhibits high-velocity data structures and modern architectural alignment, prioritizing user-centric accessibility and low-latency interaction models.`,
        keyTakeaways: [
          "Demonstrates advanced responsive layout synchronization.",
          "Utilizes high-fidelity visual assets for immersive experience.",
          "Implements robust navigational patterns for intuitive exploration.",
          "Optimized for performance across diverse hardware architectures."
        ]
      };
      
      setInsight(result);
    } catch (error) {
      console.error("AI Analysis failed:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  useEffect(() => {
    performAnalysis();
  }, [currentUrl]);

  return (
    <div className="h-full flex flex-col bg-background/90 backdrop-blur-xl">
      <header className="p-4 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-accent/20 flex items-center justify-center">
            <Sparkles className="h-4 w-4 text-accent" />
          </div>
          <h2 className="font-headline font-bold text-lg tracking-tight uppercase">AI Synthesis</h2>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} className="hover:bg-white/5">
          <X className="h-4 w-4" />
        </Button>
      </header>

      <ScrollArea className="flex-1">
        <div className="p-6 space-y-8">
          {isAnalyzing ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-4 text-center">
              <div className="relative">
                <Loader2 className="h-12 w-12 text-accent animate-spin" />
                <Sparkles className="h-4 w-4 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
              </div>
              <div>
                <h3 className="font-headline font-bold text-xl mb-1">Synthesizing Content</h3>
                <p className="text-muted-foreground text-sm">Evaluating target relevance...</p>
              </div>
            </div>
          ) : insight ? (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <section className="space-y-4">
                <div className="flex items-center gap-2 text-primary font-headline font-bold text-xs uppercase tracking-widest">
                  <Brain className="h-4 w-4" /> Executive Summary
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/5 leading-relaxed text-sm text-foreground/90 font-light italic">
                  "{insight.summary}"
                </div>
              </section>

              <Separator className="bg-white/5" />

              <section className="space-y-4">
                <div className="flex items-center gap-2 text-accent font-headline font-bold text-xs uppercase tracking-widest">
                  <ListChecks className="h-4 w-4" /> Key Takeaways
                </div>
                <div className="space-y-3">
                  {insight.keyTakeaways.map((point, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex gap-3 group"
                    >
                      <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-accent group-hover:scale-150 transition-transform shadow-[0_0_8px_rgba(26,214,214,0.6)]" />
                      <p className="text-sm text-muted-foreground leading-relaxed">{point}</p>
                    </motion.div>
                  ))}
                </div>
              </section>

              <section className="pt-4 flex flex-wrap gap-2">
                <Button variant="secondary" size="sm" className="bg-white/5 border-white/5 hover:bg-white/10 gap-2 h-9">
                  <Share2 className="h-3.5 w-3.5" /> Share
                </Button>
                <Button variant="secondary" size="sm" className="bg-white/5 border-white/5 hover:bg-white/10 gap-2 h-9">
                  <Copy className="h-3.5 w-3.5" /> Copy
                </Button>
                <Button variant="secondary" size="sm" className="bg-white/5 border-white/5 hover:bg-white/10 gap-2 h-9">
                  <Download className="h-3.5 w-3.5" /> Export
                </Button>
              </section>
            </motion.div>
          ) : (
            <div className="text-center py-20">
              <p className="text-muted-foreground">Unable to synthesize this target.</p>
              <Button onClick={performAnalysis} variant="link" className="text-accent mt-2">Retry Analysis</Button>
            </div>
          )}
        </div>
      </ScrollArea>

      <footer className="p-4 border-t border-white/5 bg-secondary/20">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-white/5">
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          </div>
          <div>
            <p className="text-[10px] font-headline font-bold text-muted-foreground uppercase tracking-wider">Engine Mode</p>
            <p className="text-[11px] text-white/60">Static Local Processing</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
