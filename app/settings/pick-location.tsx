import { useCallback, useRef, useState } from "react";
import {
  Pressable,
  StatusBar,
  Text,
  View,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useColorScheme } from "nativewind";
import { WebView } from "react-native-webview";

import BackButton from "@/components/BackButton";
import { usePlaceDraftStore } from "@/store/placeDraft";

const MAP_HTML = `
<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no">
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<style>
*{margin:0;padding:0;box-sizing:border-box}
html,body,#map{width:100%;height:100%}
</style>
</head>
<body>
<div id="map"></div>
<script>
var map=L.map('map',{zoomControl:true}).setView([26.8,30.8],7);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
attribution:'&copy; OpenStreetMap',
maxZoom:18
}).addTo(map);
var marker=null;
map.on('click',function(e){
window.ReactNativeWebView.postMessage(JSON.stringify({type:'tap',lat:e.latlng.lat,lng:e.latlng.lng}));
});
function placeMarker(lat,lng){
if(marker){
marker.setLatLng([lat,lng]);
}else{
marker=L.marker([lat,lng],{draggable:true}).addTo(map);
marker.on('dragend',function(e){
window.ReactNativeWebView.postMessage(JSON.stringify({type:'tap',lat:e.target.getLatLng().lat,lng:e.target.getLatLng().lng}));
});
}
}
</script>
</body>
</html>
`;

export default function PickLocationScreen() {
  const insets = useSafeAreaInsets();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const { latitude, longitude, setLocation } = usePlaceDraftStore();
  const webRef = useRef<WebView>(null);

  const [marker, setMarker] = useState<{ lat: number; lng: number } | null>(
    latitude !== null && longitude !== null ? { lat: latitude, lng: longitude } : null,
  );

  const handleMessage = useCallback((event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === "tap") {
        setMarker({ lat: data.lat, lng: data.lng });
        webRef.current?.injectJavaScript(`placeMarker(${data.lat},${data.lng});true;`);
      }
    } catch {}
  }, []);

  const handleConfirm = () => {
    if (marker) {
      setLocation(marker.lat, marker.lng);
    }
    router.back();
  };

  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark" style={{ paddingTop: insets.top }}>
      <StatusBar translucent backgroundColor="transparent" barStyle={isDark ? "light-content" : "dark-content"} />

      <View className="flex-row items-center px-4 py-3">
        <BackButton iconSize={18} iconName="arrow-back-ios-new" />
        <Text className="flex-1 text-lg font-bold text-main-light dark:text-white text-center mr-10">
          Pick Location
        </Text>
      </View>

      <View className="flex-1">
        <WebView
          ref={webRef}
          source={{ html: MAP_HTML }}
          style={{ flex: 1, backgroundColor: "transparent" }}
          onMessage={handleMessage}
          javaScriptEnabled
          scrollEnabled={false}
          bounces={false}
        />
      </View>

      {marker && (
        <View className="absolute top-20 left-4 right-4 bg-white dark:bg-neutral-dark rounded-xl px-4 py-3 shadow-lg">
          <Text className="text-sm text-main-light dark:text-white font-semibold text-center">
            {marker.lat.toFixed(6)}, {marker.lng.toFixed(6)}
          </Text>
        </View>
      )}

      <View className="p-6 bg-background-light dark:bg-background-dark" style={{ paddingBottom: insets.bottom + 16 }}>
        <Text className="text-xs text-sub-dark dark:text-gray-400 text-center mb-3">
          Tap on the map to drop a pin. Drag the pin to adjust.
        </Text>
        <Pressable
          onPress={handleConfirm}
          disabled={!marker}
          className="flex w-full items-center justify-center rounded-2xl h-[56px] bg-primary active:opacity-90 shadow-lg shadow-primary/20 disabled:opacity-50"
        >
          <View className="flex-row items-center gap-2">
            <MaterialIcons name="check" size={20} color="white" />
            <Text className="text-white text-lg font-semibold">Confirm Location</Text>
          </View>
        </Pressable>
      </View>
    </View>
  );
}
