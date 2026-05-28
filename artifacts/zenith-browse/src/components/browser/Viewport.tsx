import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Compass, ShieldCheck, Globe, Youtube, Github,
  Facebook, BookOpen, Zap, ExternalLink, RefreshCw, Wifi, AlertTriangle
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

// Build the proxy URL for a given target — routes through our Vite middleware
// which fetches server-side and strips X-Frame-Options headers.
function proxyUrl(target: string): string {
  const base = import.meta.env.BASE_URL ?? '/';
  // BASE_URL ends with '/', so trim the trailing slash before appending
  const proxyPath = base.replace(/\/$/, '') + '/zenith-proxy';
  return `${proxyPath}?url=${encodeURIComponent(target)}`;
}

export default function Viewport({ currentUrl, isLoading, onNavigate }: ViewportProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [proxyFailed, setProxyFailed] = useState(false);

  const isHome = currentUrl === 'zenith://welcome' || !currentUrl;
  const showIframe = !isHome && !isLoading;
  const iframeSrc = showIframe ? proxyUrl(currentUrl) : '';

  // Reset on every URL change
  useEffect(() => {
    setIframeLoaded(false);
    setProxyFailed(false);
  }, [currentUrl]);

  const handleIframeLoad = () => {
    setIframeLoaded(true);
  };

  const handleIframeError = () => {
    setProxyFailed(true);
  };

  const handleOpenExternal = () => {
    window.open(currentUrl, '_blank', 'noopener,noreferrer');
  };

  const handleReload = () => {
    setIframeLoaded(false);
    setProxyFailed(false);
    if (iframeRef.current) {
      iframeRef.current.src = proxyUrl(currentUrl);
    }
  };

  // ── Loading screen ──────────────────────────────────────────────────────────
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
            transition={{ repeat: Infinity, duration: 8, ease: 'linear' }}
          />
        </div>
        <div className="text-center space-y-2">
          <p className="text-xs font-headline tracking-[0.3em] text-primary uppercase font-bold">Initializing Pipeline</p>
          <div className="h-1 w-48 bg-white/5 rounded-full overflow-hidden mx-auto">
            <motion.div
              className="h-full bg-gradient-to-r from-primary to-accent"
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
            />
          </div>
        </div>
      </div>
    );
  }

  // ── Home / new tab screen ───────────────────────────────────────────────────
  if (isHome) {
    return (
      <div className="flex-1 bg-[#07090D] p-8 md:p-16 overflow-y-auto scrollbar-hide">
        <div className="max-w-5xl mx-auto space-y-16">
          <header className="space-y-6 text-center pt-8">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 bg-accent/10 border border-accent/20 rounded-full text-accent text-[10px] font-headline font-bold uppercase tracking-[0.2em]"
            >
              <Compass className="h-3 w-3" /> Zenith Native Engine v3.0.0
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
                    <site.icon className={cn('h-7 w-7', site.color)} />
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

  // ── In-app iframe viewer ────────────────────────────────────────────────────
  return (
    <div className="flex-1 flex flex-col bg-[#07090D] relative overflow-hidden">

      {/* Shimmer while loading */}
      {!iframeLoaded && !proxyFailed && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#07090D] space-y-4 pointer-events-none">
          <div className="h-16 w-16 rounded-2xl border border-primary/20 bg-primary/5 flex items-center justify-center animate-pulse">
            <Wifi className="h-7 w-7 text-primary" />
          </div>
          <p className="text-xs font-headline tracking-[0.25em] text-primary/70 uppercase">Loading…</p>
        </div>
      )}

      {/* Proxy / network error */}
      {proxyFailed && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#07090D] p-8 space-y-6">
          <div className="h-20 w-20 rounded-3xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center">
            <AlertTriangle className="h-10 w-10 text-yellow-400" />
          </div>
          <div className="text-center space-y-2 max-w-sm">
            <h3 className="text-lg font-headline font-bold text-white tracking-tight">Couldn't Load Page</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              The page could not be fetched. Check the address or try opening it in a browser.
            </p>
          </div>
          <div className="flex flex-col gap-3 w-full max-w-xs">
            <Button className="w-full h-12 bg-primary text-primary-foreground font-headline font-bold rounded-2xl gap-2" onClick={handleReload}>
              <RefreshCw className="h-4 w-4" /> Try Again
            </Button>
            <Button className="w-full h-12 bg-primary/10 border border-primary/30 text-primary font-headline font-bold rounded-2xl gap-2" onClick={handleOpenExternal}>
              <ExternalLink className="h-4 w-4" /> Open in Browser
            </Button>
            <Button variant="ghost" className="w-full h-10 text-muted-foreground hover:text-white font-headline font-bold text-xs uppercase tracking-widest" onClick={() => onNavigate('zenith://welcome')}>
              ← Back to Home
            </Button>
          </div>
        </div>
      )}

      {/* The proxied iframe — loaded through /zenith-proxy to strip X-Frame-Options */}
      {showIframe && (
        <iframe
          ref={iframeRef}
          key={iframeSrc}
          src={iframeSrc}
          className={cn(
            'flex-1 w-full h-full border-0 transition-opacity duration-300',
            iframeLoaded && !proxyFailed ? 'opacity-100' : 'opacity-0'
          )}
          onLoad={handleIframeLoad}
          onError={handleIframeError}
          title="Zenith Browser Viewport"
          referrerPolicy="no-referrer"
        />
      )}

      {/* Bottom toolbar — shown once page is loaded */}
      {iframeLoaded && !proxyFailed && (
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="absolute bottom-0 left-0 right-0 z-20 flex items-center justify-between px-4 py-2 bg-[#07090D]/90 border-t border-white/5 backdrop-blur-sm"
        >
          <span className="text-[10px] text-muted-foreground font-mono truncate max-w-[60%]">{currentUrl}</span>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-white" title="Reload" onClick={handleReload}>
              <RefreshCw className="h-3.5 w-3.5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-white" title="Open in Browser" onClick={handleOpenExternal}>
              <ExternalLink className="h-3.5 w-3.5" />
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
