import { useCallback, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";

const SESSION_TIMEOUT = 15 * 60 * 1000;
const ACTIVITY_DEBOUNCE = 30_000;
const CHECK_INTERVAL = 60_000;

const ACTIVITY_EVENTS: (keyof DocumentEventMap)[] = [
  "mousemove",
  "mousedown",
  "keydown",
  "scroll",
  "touchstart",
];

export function useSessionTimeout() {
  const { signOut } = useAuth();
  const lastActivityRef = useRef<number>();
  const lastWriteRef = useRef(0);

  const recordActivity = useCallback(() => {
    const now = Date.now();
    if (now - lastWriteRef.current >= ACTIVITY_DEBOUNCE) {
      lastActivityRef.current = now;
      lastWriteRef.current = now;
    }
  }, []);

  useEffect(() => {
    lastActivityRef.current = Date.now();

    for (const event of ACTIVITY_EVENTS) {
      document.addEventListener(event, recordActivity, { passive: true });
    }

    const intervalId = setInterval(() => {
      if (
        lastActivityRef.current != null &&
        Date.now() - lastActivityRef.current > SESSION_TIMEOUT
      ) {
        signOut();
      }
    }, CHECK_INTERVAL);

    return () => {
      for (const event of ACTIVITY_EVENTS) {
        document.removeEventListener(event, recordActivity);
      }
      clearInterval(intervalId);
    };
  }, [recordActivity, signOut]);
}
