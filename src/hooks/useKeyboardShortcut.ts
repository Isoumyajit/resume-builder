import { useEffect, useCallback } from "react";

interface ShortcutOptions {
  ctrl?: boolean;
  meta?: boolean;
  shift?: boolean;
  alt?: boolean;
}

export function useKeyboardShortcut(
  key: string,
  callback: () => void,
  options: ShortcutOptions = {}
) {
  const { ctrl = false, meta = false, shift = false, alt = false } = options;

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      const keyMatch = event.key.toLowerCase() === key.toLowerCase();
      
      // Check if Ctrl or Meta (Cmd on Mac) is required
      const ctrlMatch = ctrl ? event.ctrlKey : true;
      const metaMatch = meta ? event.metaKey : true;
      const shiftMatch = shift ? event.shiftKey : !event.shiftKey;
      const altMatch = alt ? event.altKey : !event.altKey;

      // For save shortcut, accept either Ctrl+S or Cmd+S
      const isSaveShortcut =
        keyMatch &&
        (event.ctrlKey || event.metaKey) &&
        !event.shiftKey &&
        !event.altKey;

      if ((ctrl || meta) && isSaveShortcut) {
        event.preventDefault();
        callback();
        return;
      }

      // General case for other shortcuts
      if (keyMatch && ctrlMatch && metaMatch && shiftMatch && altMatch) {
        event.preventDefault();
        callback();
      }
    },
    [key, callback, ctrl, meta, shift, alt]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);
}

// Convenience hook for Ctrl+S / Cmd+S
export function useSaveShortcut(callback: () => void) {
  useKeyboardShortcut("s", callback, { ctrl: true });
}
