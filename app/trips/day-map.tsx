import React, { useCallback, useMemo, useRef } from "react";
import { Pressable, StatusBar, Text, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";
import { useColorScheme } from "nativewind";
import { WebView } from "react-native-webview";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";

import BackButton from "@/components/BackButton";
import { useTripDetails } from "@/hooks/useTripDetails";

function haversineDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function formatDuration(minutes: number): string {
  if (!minutes || minutes <= 0) return "";
  const h = Math.floor(minutes / 60);
  const m = Math.round(minutes % 60);
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

function generateMapHtml(
  places: { lat: number; lng: number; index: number }[],
  isDark: boolean,
) {
  const tileUrl = isDark
    ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
    : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

  const markersJson = JSON.stringify(places.map((p) => [p.lat, p.lng]));

  return `
<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no">
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<style>
*{margin:0;padding:0;box-sizing:border-box}
html,body,#map{width:100%;height:100%}
.custom-marker{background:none;border:none!important}
</style>
</head>
<body>
<div id="map"></div>
<script>
var map=L.map('map',{zoomControl:false,attributionControl:false});
L.tileLayer('${tileUrl}',{maxZoom:18}).addTo(map);
var markers=${markersJson};
var latlngs=[];
markers.forEach(function(p,i){
  var num=i+1;
  var icon=L.divIcon({
    html:'<div style="width:28px;height:28px;background:#359EFF;color:white;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:13px;font-family:sans-serif;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3)">'+num+'</div>',
    className:'custom-marker',
    iconSize:[28,28],
    iconAnchor:[14,14]
  });
  L.marker([p[0],p[1]],{icon:icon}).addTo(map);
  latlngs.push([p[0],p[1]]);
});
if(latlngs.length>1){
  L.polyline(latlngs,{color:'#359EFF',weight:3,opacity:0.8}).addTo(map);
  L.polyline(latlngs,{color:'#359EFF',weight:3,opacity:0.4,dashArray:'6 8'}).addTo(map);
}
if(latlngs.length===1){
  map.setView(latlngs[0],14);
}else if(latlngs.length>1){
  map.fitBounds(latlngs,{padding:[30,30],maxZoom:15});
}else{
  map.setView([26.8,30.8],7);
}
</script>
</body>
</html>
`;
}

export default function DayMapScreen() {
  const insets = useSafeAreaInsets();
  const { tripId, day } = useLocalSearchParams<{ tripId: string; day: string }>();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const webRef = useRef<WebView>(null);

  const { data: trip } = useTripDetails(tripId ?? "");
  const dayNumber = parseInt(day || "1", 10);
  const segment = trip?.segments?.find((s) => s.day === dayNumber);
  const rawPlaces = segment?.places ?? [];
  const places = rawPlaces.map((p) => ({
    title: p.title,
    lat: p.latitude,
    lng: p.longitude,
    categoryName: p.category?.name ?? "",
    avgTime: p.averageVisitTime,
  }));

  const mapPlaces = useMemo(
    () =>
      places
        .filter((p) => typeof p.lat === "number" && typeof p.lng === "number")
        .map((p, idx) => ({ lat: p.lat, lng: p.lng, index: idx + 1 })),
    [places],
  );

  const totalDistance = useMemo(() => {
    let dist = 0;
    for (let i = 1; i < places.length; i++) {
      dist += haversineDistance(
        places[i - 1].lat,
        places[i - 1].lng,
        places[i].lat,
        places[i].lng,
      );
    }
    return dist;
  }, [places]);

  const durationMinutes = segment?.duration ?? 0;

  const html = useMemo(
    () => generateMapHtml(mapPlaces, isDark),
    [mapPlaces, isDark],
  );

  const handleZoomIn = useCallback(() => {
    webRef.current?.injectJavaScript("map.zoomIn();true;");
  }, []);

  const handleZoomOut = useCallback(() => {
    webRef.current?.injectJavaScript("map.zoomOut();true;");
  }, []);

  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark">
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle={isDark ? "light-content" : "dark-content"}
      />

      {/* Header */}
      <View
        className="bg-white dark:bg-background-dark px-4 flex-row items-center justify-between border-b border-slate-100 dark:border-slate-800"
        style={{ height: 56 + insets.top, paddingTop: insets.top }}
      >
        <View className="p-2 -ml-2 rounded-full">
          <BackButton iconSize={18} iconName="arrow-back-ios-new" />
        </View>
        <Text className="text-base font-bold text-[#0c141d] dark:text-white">
          Day {dayNumber}
        </Text>
        <View className="w-10" />
      </View>

      {/* Map */}
      <View className="flex-1 relative">
        <WebView
          ref={webRef}
          source={{ html }}
          style={{
            flex: 1,
            backgroundColor: isDark ? "#0f1923" : "#f7f1e3",
          }}
          javaScriptEnabled
          scrollEnabled={false}
          bounces={false}
        />

        {/* Zoom controls */}
        <View className="absolute right-4 top-4 flex-col gap-2 z-10">
          <Pressable
            onPress={handleZoomIn}
            className="w-10 h-10 bg-white dark:bg-slate-800 rounded-lg shadow-md items-center justify-center border border-slate-100 dark:border-slate-700 active:scale-95"
          >
            <MaterialIcons
              name="add"
              size={20}
              color={isDark ? "#cbd5e1" : "#475569"}
            />
          </Pressable>
          <Pressable
            onPress={handleZoomOut}
            className="w-10 h-10 bg-white dark:bg-slate-800 rounded-lg shadow-md items-center justify-center border border-slate-100 dark:border-slate-700 active:scale-95"
          >
            <MaterialIcons
              name="remove"
              size={20}
              color={isDark ? "#cbd5e1" : "#475569"}
            />
          </Pressable>
        </View>
      </View>

      {/* Bottom sheet */}
      <BottomSheet
        snapPoints={["30%", "70%"]}
        index={0}
        enablePanDownToClose={false}
        handleIndicatorStyle={{
          width: 64,
          height: 6,
          backgroundColor: isDark ? "#334155" : "#e2e8f0",
          borderRadius: 3,
        }}
        backgroundStyle={{
          backgroundColor: isDark ? "#0f172a" : "#ffffff",
          borderTopLeftRadius: 32,
          borderTopRightRadius: 32,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -8 },
          shadowOpacity: 0.12,
          shadowRadius: 30,
        }}
      >
        <BottomSheetScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 16 }}>
          {/* Stats */}
          <View className="flex-row h-16 items-center shrink-0">
            <View className="flex-1 items-center">
              <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                Distance
              </Text>
              <Text className="text-sm font-bold text-slate-900 dark:text-white">
                {totalDistance.toFixed(1)} km
              </Text>
            </View>
            <View className="w-px h-6 bg-slate-200 dark:bg-slate-700" />
            <View className="flex-1 items-center">
              <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                Duration
              </Text>
              <Text className="text-sm font-bold text-slate-900 dark:text-white">
                {formatDuration(durationMinutes) || "—"}
              </Text>
            </View>
            <View className="w-px h-6 bg-slate-200 dark:bg-slate-700" />
            <View className="flex-1 items-center">
              <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                Stops
              </Text>
              <Text className="text-sm font-bold text-slate-900 dark:text-white">
                {places.length}
              </Text>
            </View>
          </View>

          <View className="px-5 shrink-0">
            <View className="w-full h-px bg-slate-100 dark:bg-slate-800" />
          </View>

          {/* Itinerary */}
          <View>
            {places.length === 0 ? (
              <View className="items-center py-8 px-4">
                <MaterialIcons name="info-outline" size={32} color="#94a3b8" />
                <Text className="text-sm text-slate-400 mt-2">
                  No places available for this day.
                </Text>
              </View>
            ) : (
              places.map((p, idx) => (
                <View key={idx} className="flex-row gap-3 py-4 px-4">
                  {/* Timeline column */}
                  <View className="items-center">
                    <View className="w-8 h-8 rounded-full bg-primary/10 items-center justify-center">
                      <Text className="text-xs font-bold text-primary">
                        {idx + 1}
                      </Text>
                    </View>
                    {idx < places.length - 1 && (
                      <View className="flex-1 w-px bg-primary/20 my-1" style={{ minHeight: 24 }} />
                    )}
                  </View>
                  <View className="w-16 h-16 rounded-xl bg-slate-100 dark:bg-slate-800 items-center justify-center flex-shrink-0 overflow-hidden">
                    <MaterialIcons name="place" size={24} color="#94a3b8" />
                  </View>
                  <View className="flex-1 min-w-0 pt-0.5">
                    <Text className="text-[15px] font-bold text-slate-900 dark:text-slate-100 truncate mb-1">
                      {p.title}
                    </Text>
                    {p.categoryName && (
                      <Text className="text-xs text-slate-500 font-medium mb-1">
                        {p.categoryName}
                      </Text>
                    )}
                    {p.avgTime ? (
                      <Text className="text-xs text-slate-400">
                        {formatDuration(p.avgTime)} duration
                      </Text>
                    ) : null}
                  </View>
                </View>
              ))
            )}
          </View>
        </BottomSheetScrollView>
      </BottomSheet>
    </View>
  );
}