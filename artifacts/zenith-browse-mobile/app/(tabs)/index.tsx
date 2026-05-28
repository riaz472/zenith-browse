import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Platform,
  Dimensions,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as WebBrowser from "expo-web-browser";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import { useColors } from "@/hooks/useColors";
import { useBrowser } from "@/context/BrowserContext";

const SPEED_DIAL = [
  { id: "g", title: "Google", url: "https://google.com", icon: "globe" as const },
  { id: "yt", title: "YouTube", url: "https://youtube.com", icon: "youtube" as const },
  { id: "gh", title: "GitHub", url: "https://github.com", icon: "github" as const },
  { id: "hn", title: "Hacker News", url: "https://news.ycombinator.com", icon: "terminal" as const },
  { id: "fb", title: "Facebook", url: "https://facebook.com", icon: "facebook" as const },
  { id: "tw", title: "Twitter", url: "https://twitter.com", icon: "twitter" as const },
];

function normalizeUrl(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) return "";
  if (trimmed.includes(".") && !trimmed.includes(" ")) {
    return trimmed.startsWith("http") ? trimmed : `https://${trimmed}`;
  }
  return `https://duckduckgo.com/?q=${encodeURIComponent(trimmed)}`;
}

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { addHistory } = useBrowser();
  const [query, setQuery] = useState("");
  const isWeb = Platform.OS === "web";

  const topPad = isWeb ? 67 : insets.top;
  const bottomPad = isWeb ? 34 : 100;

  const openUrl = async (url: string, title: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    addHistory({ url, title, timestamp: Date.now() });
    await WebBrowser.openBrowserAsync(url, {
      toolbarColor: colors.background,
      controlsColor: colors.primary,
    });
  };

  const handleSearch = () => {
    const url = normalizeUrl(query);
    if (!url) return;
    openUrl(url, query.trim());
    setQuery("");
  };

  const s = makeStyles(colors);

  return (
    <View style={[s.root, { backgroundColor: colors.background }]}>
      <View style={[s.addressBar, { paddingTop: topPad + 12 }]}>
        <View style={s.logoRow}>
          <View style={[s.logoBox, { backgroundColor: colors.primary }]}>
            <Text style={s.logoLetter}>Z</Text>
          </View>
          <Text style={[s.logoText, { color: colors.foreground }]}>ZENITH</Text>
        </View>

        <View style={[s.searchRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Feather name="search" size={16} color={colors.mutedForeground} style={{ marginRight: 8 }} />
          <TextInput
            style={[s.searchInput, { color: colors.foreground }]}
            placeholder="Search or enter address"
            placeholderTextColor={colors.mutedForeground}
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="go"
            autoCapitalize="none"
            autoCorrect={false}
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={handleSearch}>
              <Feather name="arrow-right" size={16} color={colors.primary} />
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity
          style={[s.aiButton, { backgroundColor: colors.card, borderColor: colors.accent }]}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.push("/insight");
          }}
        >
          <Feather name="cpu" size={16} color={colors.accent} />
          <Text style={[s.aiButtonText, { color: colors.accent }]}>INSIGHT</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={[s.scrollContent, { paddingBottom: bottomPad }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={s.sectionHeader}>
          <Feather name="zap" size={12} color={colors.accent} />
          <Text style={[s.sectionTitle, { color: colors.mutedForeground }]}>SPEED DIAL HUB</Text>
        </View>

        <View style={s.grid}>
          {SPEED_DIAL.map((site) => (
            <TouchableOpacity
              key={site.id}
              style={[s.dialCard, { backgroundColor: colors.card, borderColor: colors.border }]}
              onPress={() => openUrl(site.url, site.title)}
              activeOpacity={0.7}
            >
              <View style={[s.dialIcon, { backgroundColor: colors.secondary }]}>
                <Feather name={site.icon} size={22} color={colors.primary} />
              </View>
              <Text style={[s.dialTitle, { color: colors.foreground }]} numberOfLines={1}>
                {site.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={s.hero}>
          <View style={[s.heroBadge, { backgroundColor: colors.accent + "22", borderColor: colors.accent + "44" }]}>
            <Feather name="cpu" size={11} color={colors.accent} />
            <Text style={[s.heroBadgeText, { color: colors.accent }]}>ZENITH NATIVE ENGINE V3.0.0</Text>
          </View>
          <Text style={[s.heroTitle, { color: colors.foreground }]}>
            {"ZENITH "}
            <Text style={[s.heroTitleAccent, { color: colors.primary }]}>BROWSE</Text>
          </Text>
          <Text style={[s.heroSubtitle, { color: colors.mutedForeground }]}>
            The next generation of intelligent web exploration.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 48 - 12) / 3;

function makeStyles(colors: ReturnType<typeof useColors>) {
  return StyleSheet.create({
    root: { flex: 1 },
    addressBar: {
      paddingHorizontal: 16,
      paddingBottom: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      gap: 10,
    },
    logoRow: { flexDirection: "row", alignItems: "center", gap: 8 },
    logoBox: {
      width: 30, height: 30, borderRadius: 8,
      alignItems: "center", justifyContent: "center",
    },
    logoLetter: { color: "#fff", fontWeight: "bold", fontSize: 16, fontFamily: "Inter_700Bold" },
    logoText: { fontSize: 16, fontWeight: "bold", letterSpacing: 2, fontFamily: "Inter_700Bold" },
    searchRow: {
      flexDirection: "row", alignItems: "center",
      paddingHorizontal: 12, paddingVertical: 10, borderRadius: 12, borderWidth: 1,
    },
    searchInput: { flex: 1, fontSize: 14, fontFamily: "Inter_400Regular" },
    aiButton: {
      flexDirection: "row", alignItems: "center", gap: 6,
      paddingHorizontal: 14, paddingVertical: 9, borderRadius: 12, borderWidth: 1, alignSelf: "flex-start",
    },
    aiButtonText: { fontSize: 12, fontWeight: "bold", letterSpacing: 1.5, fontFamily: "Inter_700Bold" },
    scrollContent: { paddingTop: 24, paddingHorizontal: 16 },
    sectionHeader: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 16 },
    sectionTitle: { fontSize: 10, fontWeight: "bold", letterSpacing: 2, fontFamily: "Inter_700Bold" },
    grid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
    dialCard: {
      width: CARD_WIDTH, paddingVertical: 18, paddingHorizontal: 8,
      borderRadius: 16, borderWidth: 1, alignItems: "center", gap: 10,
    },
    dialIcon: { width: 48, height: 48, borderRadius: 14, alignItems: "center", justifyContent: "center" },
    dialTitle: { fontSize: 12, fontFamily: "Inter_500Medium", textAlign: "center" },
    hero: { marginTop: 36, alignItems: "center", gap: 12 },
    heroBadge: {
      flexDirection: "row", alignItems: "center", gap: 6,
      paddingHorizontal: 12, paddingVertical: 6, borderRadius: 99, borderWidth: 1,
    },
    heroBadgeText: { fontSize: 10, fontWeight: "bold", letterSpacing: 1.5, fontFamily: "Inter_700Bold" },
    heroTitle: { fontSize: 36, fontWeight: "900", letterSpacing: 2, fontFamily: "Inter_700Bold", textAlign: "center" },
    heroTitleAccent: { fontStyle: "italic" },
    heroSubtitle: { fontSize: 14, fontFamily: "Inter_400Regular", textAlign: "center" },
  });
}
