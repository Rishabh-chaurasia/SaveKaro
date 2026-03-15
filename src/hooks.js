/* hooks.js — shared custom hooks with localStorage persistence */
import { useState, useEffect, useCallback } from "react";

/* Persist state to localStorage */
export function usePersist(key, initial) {
  const [state, setState] = useState(() => {
    try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : initial; }
    catch { return initial; }
  });
  useEffect(() => { try { localStorage.setItem(key, JSON.stringify(state)); } catch {} }, [key, state]);
  return [state, setState];
}

/* Flash sale countdown */
export function useCountdown(endTime) {
  const [time, setTime] = useState({ h:"00", m:"00", s:"00" });
  useEffect(() => {
    const tick = () => {
      const d = endTime - Date.now();
      if (d <= 0) { setTime({ h:"00", m:"00", s:"00" }); return; }
      setTime({ h:String(Math.floor(d/3600000)).padStart(2,"0"), m:String(Math.floor((d%3600000)/60000)).padStart(2,"0"), s:String(Math.floor((d%60000)/1000)).padStart(2,"0") });
    };
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, [endTime]);
  return time;
}

/* Per-product expiry countdown */
export function useExpiry(hoursFromNow) {
  const endTime = Date.now() + hoursFromNow * 3600000;
  return useCountdown(endTime);
}

/* Toast notifications */
export function useToast() {
  const [toast, setToast] = useState(null);
  const showToast = useCallback((msg, type = "success") => {
    setToast({ msg, type, id: Date.now() });
    setTimeout(() => setToast(null), 3200);
  }, []);
  return [toast, showToast];
}

/* Loyalty points */
export function usePoints() {
  const [points, setPoints] = usePersist("dk_points", 0);
  const [history, setHistory] = usePersist("dk_points_history", []);
  const award = useCallback((amount, reason) => {
    setPoints(p => p + amount);
    setHistory(h => [{ amount, reason, date: new Date().toLocaleDateString(), id: Date.now() }, ...h].slice(0, 50));
  }, [setPoints, setHistory]);
  return { points, history, award };
}

/* User auth state (mock — integrate Firebase/Supabase in production) */
export function useAuth() {
  const [user, setUser] = usePersist("dk_user", null);
  const login = useCallback((data) => setUser(data), [setUser]);
  const logout = useCallback(() => setUser(null), [setUser]);
  return { user, login, logout };
}