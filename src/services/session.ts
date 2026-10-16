import * as SecureStore from 'expo-secure-store';
import { useEffect, useState } from 'react';

export type Role = 'organizer' | 'staff' | 'attendee';
export type Session = {
  token: string;
  user: { id: string; fullName: string; email: string; role: Role };
};
const KEY = 'eventify.session';
let current: Session | null = null;
let loaded = false;
let loading: Promise<void> | null = null;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

export function loadSession(): Promise<void> {
  if (!loading) {
    loading = SecureStore.getItemAsync(KEY)
      .then((raw) => {
        try {
          current = raw ? JSON.parse(raw) : null;
        } catch {
          current = null;
        }
      })
      .catch(() => {
        current = null;
      })
      .finally(() => {
        loaded = true;
        emit();
      });
  }
  return loading!;
}
export async function getToken(): Promise<string | null> {
  await loadSession();
  return current?.token ?? null;
}
export function getSession() {
  return current;
}
export async function saveSession(s: Session) {
  current = s;
  loaded = true;
  await SecureStore.setItemAsync(KEY, JSON.stringify(s));
  emit();
}
export async function clearSession() {
  current = null;
  await SecureStore.deleteItemAsync(KEY).catch(() => {});
  emit();
}
export function useSession() {
  const [, tick] = useState(0);
  useEffect(() => {
    const l = () => tick((n) => n + 1);
    listeners.add(l);
    loadSession();
    return () => {
      listeners.delete(l);
    };
  }, []);
  return { session: current, ready: loaded };
}
