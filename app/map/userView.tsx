import React, { useCallback, useEffect, useMemo, useRef } from "react";
import {
  Pressable,
  StatusBar,
  Text,
  View,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";
import { useLocalSearchParams } from "expo-router";
import { useColorScheme } from "nativewind";
import BackButton from "@/components/BackButton";
import { getUserId } from "@/utils/storage";
import { useTripLocations } from "@/hooks/useTripLocations";
import { useLocationStore } from "@/store/locationStore";

function generateMapHtml(
  locations: { lat: number; lng: number; userId: string; isSelf: boolean }[],
  selfLat: number | null,
  selfLng: number | null,
  isDark: boolean,
) {
  const tileUrl = isDark
    ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
    : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

  const locationsJson = JSON.stringify(locations);
  const selfLatJs = selfLat ?? "null";
  const selfLngJs = selfLng ?? "null";

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
.marker-icon{background:none;border:none!important}
</style>
</head>
<body>
<div id="map"></div>
<script>
var map=L.map('map',{zoomControl:false,attributionControl:false});
L.tileLayer('${tileUrl}',{maxZoom:18}).addTo(map);
var markers={};
var allLatlngs=[];

function buildPulseColor(hex){
  return '<svg width="36" height="36" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">'+
    '<circle cx="18" cy="18" r="16" fill="'+hex+'" opacity="0.25">'+
      '<animate attributeName="r" values="16;22;16" dur="2s" repeatCount="indefinite"/>'+
      '<animate attributeName="opacity" values="0.25;0.05;0.25" dur="2s" repeatCount="indefinite"/>'+
    '</circle>'+
    '<circle cx="18" cy="18" r="10" fill="'+hex+'" stroke="white" stroke-width="2"/>'+
  '</svg>';
}

function buildMarkerHtml(userId, bg, label){
  return '<div style="width:36px;height:36px;display:flex;align-items:center;justify-content:center">'+
    buildPulseColor(bg)+
    '</div>';
}

function renderLocations(locs, selfLat, selfLng){
  Object.keys(markers).forEach(function(id){
    if(id==='__self__') return;
    if(!locs.find(function(l){return l.userId===id;})){
      map.removeLayer(markers[id]);
      delete markers[id];
    }
  });
  var bounds=[];
  locs.forEach(function(l){
    var existing=markers[l.userId];
    var bg=l.isSelf?'#359EFF':'#f97316';
    var icon=L.divIcon({
      html:buildMarkerHtml(l.userId,bg,''),
      className:'marker-icon',
      iconSize:[36,36],
      iconAnchor:[18,18]
    });
    if(existing){
      existing.setLatLng([l.lat,l.lng]);
      existing.setIcon(icon);
    }else{
      var mkr=L.marker([l.lat,l.lng],{icon:icon,zIndexOffset:l.isSelf?1000:0}).addTo(map);
      markers[l.userId]=mkr;
    }
    bounds.push([l.lat,l.lng]);
  });
  if(selfLat!==null&&selfLng!==null){
    var selfId='__self__';
    var existing=markers[selfId];
    var icon=L.divIcon({
      html:buildMarkerHtml(selfId,'#359EFF',''),
      className:'marker-icon',
      iconSize:[36,36],
      iconAnchor:[18,18]
    });
    if(existing){
      existing.setLatLng([selfLat,selfLng]);
      existing.setIcon(icon);
    }else{
      var mkr=L.marker([selfLat,selfLng],{icon:icon,zIndexOffset:2000}).addTo(map);
      markers[selfId]=mkr;
    }
    bounds.push([selfLat,selfLng]);
  }
  if(bounds.length===1){
    map.setView(bounds[0],15);
  }else if(bounds.length>1){
    map.fitBounds(bounds,{padding:[50,50],maxZoom:16});
  }else{
    map.setView([26.8,30.8],7);
  }
}

var initialLocs=${locationsJson};
var initialSelfLat=${selfLatJs};
var initialSelfLng=${selfLngJs};
renderLocations(initialLocs,initialSelfLat,initialSelfLng);
</script>
</body>
</html>
`;
}

export default function LiveTripMapUserView() {
  const insets = useSafeAreaInsets();
  const { tripId } = useLocalSearchParams<{ tripId: string }>();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const webRef = useRef<WebView>(null);

  const locations = useTripLocations(tripId ?? "");
  const currentUserId = getUserId();
  const selfLat = useLocationStore((s) => s.currentLatitude);
  const selfLng = useLocationStore((s) => s.currentLongitude);
  const locationError = useLocationStore((s) => s.gpsError);

  const mapLocations = useMemo(
    () =>
      locations
        .filter(
          (l) =>
            l.userId !== currentUserId &&
            typeof l.latitude === "number" &&
            typeof l.longitude === "number",
        )
        .map((l) => ({
          lat: l.latitude,
          lng: l.longitude,
          userId: l.userId,
          isSelf: false,
        })),
    [locations, currentUserId],
  );

  const prevLocationsRef = useRef<string>("");

  const locationsJson = useMemo(
    () => JSON.stringify(mapLocations),
    [mapLocations],
  );

  useEffect(() => {
    if (!webRef.current) return;
    if (locationsJson === prevLocationsRef.current) return;
    prevLocationsRef.current = locationsJson;

    const js = `renderLocations(${locationsJson},${selfLat ?? "null"},${selfLng ?? "null"});true;`;
    webRef.current.injectJavaScript(js);
  }, [locationsJson, selfLat, selfLng]);

  const html = useMemo(
    () => generateMapHtml(mapLocations, selfLat, selfLng, isDark),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isDark],
  );

  const handleZoomIn = useCallback(() => {
    webRef.current?.injectJavaScript("map.zoomIn();true;");
  }, []);

  const handleZoomOut = useCallback(() => {
    webRef.current?.injectJavaScript("map.zoomOut();true;");
  }, []);

  const participantCount = locations.length;

  return (
    <View className="flex-1 bg-slate-200" style={{ paddingTop: insets.top }}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle={isDark ? "light-content" : "dark-content"}
      />

      {/* Map */}
      <View className="flex-1 relative">
        <WebView
          ref={webRef}
          source={{ html }}
          style={{ flex: 1, backgroundColor: isDark ? "#0f1923" : "#f7f1e3" }}
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

        {/* Location error banner */}
        {locationError && (
          <View className="absolute top-4 left-4 right-4 bg-red-500/90 rounded-xl px-4 py-3 flex-row items-center gap-2">
            <MaterialIcons name="location-off" size={18} color="white" />
            <Text className="text-white text-sm font-medium flex-1">
              {locationError}
            </Text>
          </View>
        )}

        {/* Floating top controls */}
        <View
          className="absolute top-4 left-4 right-4 flex-row items-center justify-between"
          style={{ top: insets.top + 16 }}
        >
          <BackButton iconSize={18} iconName="arrow-back-ios-new" />
          <View className="flex-row items-center gap-2 bg-white px-4 py-2 rounded-full shadow-lg">
            <View className="w-2 h-2 rounded-full bg-green-500" />
            <Text className="text-sm font-bold text-slate-900">Live Trip</Text>
            <Text className="text-xs text-slate-500">
              {participantCount > 0 ? `• ${participantCount}` : ""}
            </Text>
          </View>
          <View className="w-10" />
        </View>
      </View>

      {/* Bottom card */}
      <View
        className="bg-white rounded-t-3xl shadow-2xl p-6"
        style={{ paddingBottom: insets.bottom + 16 }}
      >
        <View className="w-10 h-1 bg-gray-300 rounded-full self-center mb-4" />

        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-lg font-bold text-slate-900">
            Trip Participants
          </Text>
        </View>

        {locations.length === 0 && !locationError && (
          <View className="items-center py-6">
            <MaterialIcons name="people-outline" size={32} color="#94a3b8" />
            <Text className="text-sm text-slate-400 mt-2">
              Waiting for participant locations...
            </Text>
          </View>
        )}

        {locations.map((loc) => (
          <View
            key={loc.userId}
            className="flex-row items-center gap-3 bg-slate-50 rounded-xl p-3 mb-2"
          >
            <View className="w-10 h-10 rounded-full bg-primary/10 items-center justify-center">
              <MaterialIcons name="person" size={20} color="#359EFF" />
            </View>
            <View className="flex-1">
              <Text className="font-semibold text-slate-900 text-sm">
                {loc.userId === currentUserId ? "You" : `Participant`}
              </Text>
              <Text className="text-sub-light text-xs">
                {new Date(loc.updatedAt).toLocaleTimeString()}
              </Text>
            </View>
            <View className="w-2 h-2 rounded-full bg-green-500" />
          </View>
        ))}
      </View>
    </View>
  );
}
