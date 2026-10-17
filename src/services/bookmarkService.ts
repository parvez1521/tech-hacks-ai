import type { BookmarkItem } from '../types/index.ts';

const STORAGE_KEY = 'openalt_saved_items';

type BookmarkListener = (items: BookmarkItem[]) => void;
const listeners = new Set<BookmarkListener>();

function notifyListeners(items: BookmarkItem[]) {
  listeners.forEach((listener) => {
    try {
      listener(items);
    } catch {
      // Ignore listener error
    }
  });
}

export function getBookmarks(): BookmarkItem[] {
  if (typeof window === 'undefined' || !window.localStorage) {
    return [];
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.warn('Failed to parse bookmarks from localStorage', err);
    return [];
  }
}

export function addBookmark(item: BookmarkItem): void {
  if (typeof window === 'undefined' || !window.localStorage) return;
  try {
    const current = getBookmarks();
    if (current.some((b) => b.id === item.id)) return;
    const updated = [item, ...current];
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    notifyListeners(updated);
  } catch (err) {
    console.warn('Failed to save bookmark', err);
  }
}

export function removeBookmark(id: string): void {
  if (typeof window === 'undefined' || !window.localStorage) return;
  try {
    const current = getBookmarks();
    const updated = current.filter((b) => b.id !== id);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    notifyListeners(updated);
  } catch (err) {
    console.warn('Failed to remove bookmark', err);
  }
}

export function isBookmarked(id: string): boolean {
  const current = getBookmarks();
  return current.some((b) => b.id === id);
}

export function clearBookmarks(): void {
  if (typeof window === 'undefined' || !window.localStorage) return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
    notifyListeners([]);
  } catch (err) {
    console.warn('Failed to clear bookmarks', err);
  }
}

export function subscribeBookmarks(listener: BookmarkListener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
