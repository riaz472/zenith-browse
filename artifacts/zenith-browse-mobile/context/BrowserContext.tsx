import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";

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
};

const DEFAULT_BOOKMARKS: Bookmark[] = [
  { id: "1", url: "https://news.ycombinator.com", title: "Hacker News", category: "Tech" },
  { id: "2", url: "https://vercel.com", title: "Vercel", category: "Dev" },
  { id: "3", url: "https://openai.com", title: "OpenAI", category: "AI" },
  { id: "4", url: "https://dribbble.com", title: "Dribbble", category: "Design" },
  { id: "5", url: "https://github.com", title: "GitHub", category: "Dev" },
  { id: "6", url: "https://youtube.com", title: "YouTube", category: "Media" },
];

type BrowserContextType = {
  history: BrowserPage[];
  bookmarks: Bookmark[];
  addHistory: (page: BrowserPage) => void;
  clearHistory: () => void;
  addBookmark: (b: Bookmark) => void;
  removeBookmark: (id: string) => void;
};

const BrowserContext = createContext<BrowserContextType>({
  history: [],
  bookmarks: [],
  addHistory: () => {},
  clearHistory: () => {},
  addBookmark: () => {},
  removeBookmark: () => {},
});

export function BrowserProvider({ children }: { children: React.ReactNode }) {
  const [history, setHistory] = useState<BrowserPage[]>([]);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(DEFAULT_BOOKMARKS);

  useEffect(() => {
    (async () => {
      try {
        const h = await AsyncStorage.getItem("browser_history");
        const b = await AsyncStorage.getItem("browser_bookmarks");
        if (h) setHistory(JSON.parse(h));
        if (b) setBookmarks(JSON.parse(b));
      } catch {}
    })();
  }, []);

  const addHistory = (page: BrowserPage) => {
    setHistory((prev) => {
      const updated = [page, ...prev.slice(0, 99)];
      AsyncStorage.setItem("browser_history", JSON.stringify(updated)).catch(() => {});
      return updated;
    });
  };

  const clearHistory = () => {
    setHistory([]);
    AsyncStorage.removeItem("browser_history").catch(() => {});
  };

  const addBookmark = (b: Bookmark) => {
    setBookmarks((prev) => {
      const updated = [b, ...prev];
      AsyncStorage.setItem("browser_bookmarks", JSON.stringify(updated)).catch(() => {});
      return updated;
    });
  };

  const removeBookmark = (id: string) => {
    setBookmarks((prev) => {
      const updated = prev.filter((b) => b.id !== id);
      AsyncStorage.setItem("browser_bookmarks", JSON.stringify(updated)).catch(() => {});
      return updated;
    });
  };

  return (
    <BrowserContext.Provider value={{ history, bookmarks, addHistory, clearHistory, addBookmark, removeBookmark }}>
      {children}
    </BrowserContext.Provider>
  );
}

export function useBrowser() {
  return useContext(BrowserContext);
}
