import { useState, useCallback, useRef } from 'react';

type ToastType = 'success' | 'error' | 'info' | 'warning';

type Toast = {
  id: string;
  message: string;
  type: ToastType;
};

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timerRef = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  const show = useCallback((message: string, type: ToastType = 'info', duration = 3000) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);

    timerRef.current[id] = setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
      delete timerRef.current[id];
    }, duration);
  }, []);

  const dismiss = useCallback((id: string) => {
    clearTimeout(timerRef.current[id]);
    delete timerRef.current[id];
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const success = useCallback((msg: string) => show(msg, 'success'), [show]);
  const error = useCallback((msg: string) => show(msg, 'error', 4000), [show]);
  const info = useCallback((msg: string) => show(msg, 'info'), [show]);
  const warning = useCallback((msg: string) => show(msg, 'warning'), [show]);

  return { toasts, show, dismiss, success, error, info, warning };
}
