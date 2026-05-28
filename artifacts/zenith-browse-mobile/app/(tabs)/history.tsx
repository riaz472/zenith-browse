import React from "react";
import {
  View, Text, TouchableOpacity, FlatList,
  StyleSheet, Platform, Alert,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as WebBrowser from "expo-web-browser";
import * as Haptics from "expo-haptics";
import { useColors } from "@/hooks/useColors";
import { useBrowser, BrowserPage } from "@/context/BrowserContext";

function formatTime(ts: number): string {
  return new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function formatDate(ts: number): string {
  const d = new Date(ts);
  const today = new Date();
  if (d.toDateString() === today.toDateString()) return "Today";
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
  return d.toLocaleDateString([], { month: "short", day: "numeric" });
}

type ListRow =
  | { kind: "header"; date: string; key: string }
  | { kind: "item"; item: BrowserPage; key: string };

export default function HistoryScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { history, clearHistory, addHistory } = useBrowser();
  const isWeb = Platform.OS === "web";
  const topPad = isWeb ? 67 : insets.top;
  const bottomPad = isWeb ? 34 : 100;
  const s = makeStyles(colors);

  const handleClear = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert("Clear Timeline", "Remove all navigation history?", [
      { text: "Cancel", style: "cancel" },
      { text: "Clear", style: "destructive", onPress: clearHistory },
    ]);
  };

  const openItem = async (item: BrowserPage) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    addHistory({ url: item.url, title: item.title, timestamp: Date.now() });
    await WebBrowser.openBrowserAsync(item.url, { toolbarColor: colors.background, controlsColor: colors.primary });
  };

  const grouped: { date: string; items: BrowserPage[] }[] = [];
  history.forEach((item) => {
    const label = formatDate(item.timestamp);
    const last = grouped[grouped.length - 1];
    if (last && last.date === label) { last.items.push(item); }
    else { grouped.push({ date: label, items: [item] }); }
  });

  const flatData: ListRow[] = [];
  grouped.forEach((g) => {
    flatData.push({ kind: "header", date: g.date, key: `h-${g.date}` });
    g.items.forEach((item, i) =>
      flatData.push({ kind: "item", item, key: `${item.url}-${item.timestamp}-${i}` })
    );
  });

  return (
    <View style={[s.root, { backgroundColor: colors.background }]}>
      <View style={[s.header, { paddingTop: topPad + 16 }]}>
        <View>
          <Text style={[s.headerTitle, { color: colors.foreground }]}>Timeline</Text>
          <Text style={[s.headerSub, { color: colors.mutedForeground }]}>{history.length} navigation events</Text>
        </View>
        {history.length > 0 && (
          <TouchableOpacity style={[s.clearBtn, { borderColor: colors.border }]} onPress={handleClear}>
            <Feather name="trash-2" size={16} color={colors.mutedForeground} />
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={flatData}
        keyExtractor={(row) => row.key}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: bottomPad, paddingTop: 8 }}
        scrollEnabled={flatData.length > 0}
        ListEmptyComponent={
          <View style={s.empty}>
            <Feather name="clock" size={36} color={colors.muted} />
            <Text style={[s.emptyText, { color: colors.mutedForeground }]}>Timeline is clear</Text>
            <Text style={[s.emptyHint, { color: colors.mutedForeground }]}>Sites you visit will appear here</Text>
          </View>
        }
        renderItem={({ item: row }) => {
          if (row.kind === "header") {
            return (
              <View style={s.dateHeader}>
                <Text style={[s.dateHeaderText, { color: colors.primary }]}>{row.date.toUpperCase()}</Text>
                <View style={[s.dateLine, { backgroundColor: colors.border }]} />
              </View>
            );
          }
          const { item } = row;
          return (
            <TouchableOpacity
              style={[s.card, { backgroundColor: colors.card, borderColor: colors.border }]}
              onPress={() => openItem(item)}
              activeOpacity={0.75}
            >
              <View style={[s.clockIcon, { backgroundColor: colors.secondary }]}>
                <Feather name="clock" size={14} color={colors.primary} />
              </View>
              <View style={s.cardInfo}>
                <Text style={[s.cardTitle, { color: colors.foreground }]} numberOfLines={1}>
                  {item.title || item.url}
                </Text>
                <Text style={[s.cardUrl, { color: colors.mutedForeground }]} numberOfLines={1}>
                  {item.url.replace(/(^\w+:|^)\/\//, "")}
                </Text>
              </View>
              <Text style={[s.timeText, { color: colors.mutedForeground }]}>{formatTime(item.timestamp)}</Text>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

function makeStyles(colors: ReturnType<typeof useColors>) {
  return StyleSheet.create({
    root: { flex: 1 },
    header: {
      flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between",
      paddingHorizontal: 20, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: colors.border,
    },
    headerTitle: { fontSize: 28, fontWeight: "bold", fontFamily: "Inter_700Bold" },
    headerSub: { fontSize: 13, fontFamily: "Inter_400Regular", marginTop: 2 },
    clearBtn: { width: 40, height: 40, borderRadius: 12, borderWidth: 1, alignItems: "center", justifyContent: "center" },
    empty: { paddingTop: 80, alignItems: "center", gap: 8 },
    emptyText: { fontSize: 16, fontFamily: "Inter_600SemiBold", marginTop: 8 },
    emptyHint: { fontSize: 13, fontFamily: "Inter_400Regular" },
    dateHeader: { flexDirection: "row", alignItems: "center", gap: 10, marginTop: 20, marginBottom: 8 },
    dateHeaderText: { fontSize: 9, fontWeight: "bold", letterSpacing: 2, fontFamily: "Inter_700Bold" },
    dateLine: { flex: 1, height: 1 },
    card: {
      flexDirection: "row", alignItems: "center", gap: 12,
      padding: 14, borderRadius: 14, borderWidth: 1, marginBottom: 8,
    },
    clockIcon: { width: 34, height: 34, borderRadius: 10, alignItems: "center", justifyContent: "center" },
    cardInfo: { flex: 1 },
    cardTitle: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
    cardUrl: { fontSize: 12, fontFamily: "Inter_400Regular", marginTop: 2 },
    timeText: { fontSize: 11, fontFamily: "Inter_400Regular" },
  });
}
