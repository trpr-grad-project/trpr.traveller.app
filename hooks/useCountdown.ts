import { useCallback, useEffect, useRef, useState } from "react";

export function useCountdown(durationSeconds = 60) {
  const [secondsLeft, setSecondsLeft] = useState(durationSeconds);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const start = useCallback(() => {
    clearTimer();
    setSecondsLeft(durationSeconds);

    timerRef.current = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearTimer();
          return 0;
        }
        return s - 1;
      });
    }, 1000);
  }, [durationSeconds, clearTimer]);

  useEffect(() => {
    start();
    return clearTimer;
  }, [start, clearTimer]);

  const timerLabel = `${String(Math.floor(secondsLeft / 60)).padStart(2, "0")}:${String(secondsLeft % 60).padStart(2, "0")}`;

  return {
    secondsLeft,
    timerLabel,
    isExpired: secondsLeft === 0,
    restart: start,
  };
}
