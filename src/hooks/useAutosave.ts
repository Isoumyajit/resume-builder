import { useEffect, useRef, useState } from "react";
import type { UseFormReturn, DeepPartial } from "react-hook-form";
import type { ResumeFormData } from "@/lib/validation";
import { useDebouncedCallback } from "use-debounce";

export const AUTO_SAVE_DELAY = 10000;
export const AUTO_SAVE_KEY = "rb-resume-data";
export const AUTO_SAVE_TIMESTAMP_KEY = "rb-resume-timestamp";

export type AutoSaveStatus = "Idle" | "Saving" | "Error" | "Saved" | string;

export function useAutosave(form: UseFormReturn<ResumeFormData>) {
  const [status, setStatus] = useState<AutoSaveStatus>("Idle");
  const savedAtRef = useRef<number>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const debouncedSave = useDebouncedCallback(
    (formValues: DeepPartial<ResumeFormData>) => {
      localStorage.setItem(AUTO_SAVE_KEY, JSON.stringify(formValues));
      localStorage.setItem(AUTO_SAVE_TIMESTAMP_KEY, Date.now().toString());
      savedAtRef.current = Date.now();
      setStatus("Saved");
    },
    AUTO_SAVE_DELAY,
  );

  useEffect(() => {
    const subscription = form.watch((formValues) => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      debouncedSave(formValues);
    });

    return () => {
      subscription.unsubscribe();
      debouncedSave.flush();
    };
  }, [form, debouncedSave]);

  const formatTimeAgo = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return `Last saved ${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `Last saved ${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `Last saved ${hours}h ago`;
  };

  useEffect(() => {
    if (status !== "Saved") {
      return;
    }
    const delayTimer = setTimeout(() => {
      setStatus(formatTimeAgo(savedAtRef.current!));

      const interval = setInterval(() => {
        setStatus(formatTimeAgo(savedAtRef.current!));
      }, 10000);

      intervalRef.current = interval;
    }, 10000);

    return () => {
      clearTimeout(delayTimer);
    };
  }, [status]);

  return status;
}
