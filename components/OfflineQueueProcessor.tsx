import { useEffect, useRef } from "react";
import { useNetworkStatus } from "@/hooks/useNetworkStatus";
import { getQueueLength, onQueueChange, processQueue } from "@/utils/offlineQueue";

export default function OfflineQueueProcessor() {
  const { isConnected } = useNetworkStatus();
  const wasOffline = useRef(false);

  useEffect(() => {
    if (!wasOffline.current && !isConnected) {
      wasOffline.current = true;
    }
    if (wasOffline.current && isConnected) {
      wasOffline.current = false;
      if (getQueueLength() > 0) {
        processQueue();
      }
    }
  }, [isConnected]);

  useEffect(() => {
    const unsub = onQueueChange(() => {
      if (isConnected && getQueueLength() > 0) {
        processQueue();
      }
    });
    return unsub;
  }, [isConnected]);

  return null;
}
