import { useColorScheme } from "nativewind";
import { useCallback, useEffect, useRef, useState } from "react";
import { StatusBar, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { WebView } from "react-native-webview";
import Toast from "react-native-toast-message";

import BackButton from "@/components/BackButton";
import PrimaryButton from "@/components/PrimaryButton";
import { useTripDraftStore } from "@/store/tripCreation";

const EGYPT_BOUNDS = { minLat: 22, maxLat: 32, minLng: 25, maxLng: 37 };

function isInEgypt(lat: number, lng: number) {
  return (
    lat >= EGYPT_BOUNDS.minLat &&
    lat <= EGYPT_BOUNDS.maxLat &&
    lng >= EGYPT_BOUNDS.minLng &&
    lng <= EGYPT_BOUNDS.maxLng
  );
}

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
var marker=null,circle=null;
map.on('click',function(e){
window.ReactNativeWebView.postMessage(JSON.stringify({type:'tap',lat:e.latlng.lat,lng:e.latlng.lng}));
});
function placeMarker(lat,lng,radius){
if(marker){
marker.setLatLng([lat,lng]);
circle.setLatLng([lat,lng]);
circle.setRadius(radius);
}else{
marker=L.marker([lat,lng]).addTo(map);
circle=L.circle([lat,lng],{radius:radius,color:'#359EFF',fillColor:'#359EFF',fillOpacity:0.15,weight:2}).addTo(map);
}
}
function updateRadius(radius){if(circle)circle.setRadius(radius);}
</script>
</body>
</html>
`;

export default function MapScreen() {
  const insets = useSafeAreaInsets();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const webRef = useRef<WebView>(null);
  const setMapLocation = useTripDraftStore((s) => s.setMapLocation);

  const [marker, setMarker] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [radius, setRadius] = useState("1000");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const r = parseInt(radius, 10);
    if (!isNaN(r) && r > 0 && marker) {
      webRef.current?.injectJavaScript(`updateRadius(${r});true;`);
    }
  }, [radius, marker]);

  const handleMessage = useCallback((event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === "tap") {
        if (!isInEgypt(data.lat, data.lng)) {
          setError("Pin must be inside Egypt");
          return;
        }
        setError(null);
        setMarker({ lat: data.lat, lng: data.lng });
        const r = parseInt(radius, 10) || 1000;
        webRef.current?.injectJavaScript(
          `placeMarker(${data.lat},${data.lng},${r});true;`,
        );
      }
    } catch {}
  }, [radius]);

  const handleConfirm = useCallback(() => {
    if (!marker) {
      setError("Please tap the map to place a pin");
      return;
    }
    const r = parseInt(radius, 10);
    if (isNaN(r) || r <= 0) {
      setError("Please enter a valid radius");
      return;
    }
    setMapLocation({ lat: marker.lat, lng: marker.lng, radius: r });
    Toast.show({
      type: "success",
      text1: "Location pinned",
      text2: `Radius: ${r}m`,
    });
    router.back();
  }, [marker, radius, setMapLocation]);

  return (
    <View
      className="flex-1 bg-white dark:bg-background-dark"
      style={{ paddingTop: insets.top }}
    >
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle={isDark ? "light-content" : "dark-content"}
      />

      <View className="flex-row items-center border-b border-slate-100 dark:border-slate-800 px-4 pt-4 pb-4">
        <BackButton iconSize={18} iconName="arrow-back-ios-new" />
        <Text className="flex-1 text-center mr-8 text-lg font-bold text-[#0c141d] dark:text-white">
          Pin Location
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

      <View className="bg-white dark:bg-background-dark px-4 py-4 border-t border-slate-100 dark:border-slate-800">
        <View>
          <Text className="text-xs font-semibold text-slate-500 mb-1">
            Radius (meters)
          </Text>
          <TextInput
            value={radius}
            onChangeText={(t) => {
              setRadius(t.replace(/[^0-9]/g, ""));
              setError(null);
            }}
            keyboardType="number-pad"
            placeholder="1000"
            placeholderTextColor="#94a3b8"
            className="w-full h-12 px-4 bg-slate-50 dark:bg-slate-900 rounded-xl text-sm font-medium text-[#0c141d] dark:text-white"
          />
        </View>

        {error && (
          <Text className="text-xs text-red-500 mt-2">{error}</Text>
        )}

        <View className="mt-3">
          <PrimaryButton title="Confirm Location" onPress={handleConfirm} />
        </View>
      </View>
    </View>
  );
}
