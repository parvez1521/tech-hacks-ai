import React, { useState, useEffect } from 'react';
import { BookmarkItem } from '../types';
import { addBookmark, removeBookmark, isBookmarked, subscribeBookmarks } from '../services/bookmarkService';
import { Bookmark } from 'lucide-react';

interface BookmarkButtonProps {
  item: BookmarkItem;
  className?: string;
  size?: 'sm' | 'md';
}

export const BookmarkButton: React.FC<BookmarkButtonProps> = ({ item, className = '', size = 'md' }) => {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSaved(isBookmarked(item.id));
    const unsubscribe = subscribeBookmarks(() => {
      setSaved(isBookmarked(item.id));
    });
    return unsubscribe;
  }, [item.id]);

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (saved) {
      removeBookmark(item.id);
    } else {
      addBookmark(item);
    }
  };

  const iconClass = size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4';
  const paddingClass = size === 'sm' ? 'p-1.5' : 'p-2';

  return (
    <button
      type="button"
      onClick={handleToggle}
      className={`relative z-20 rounded-md border transition-all duration-150 ${paddingClass} ${
        saved
          ? 'bg-primary/15 text-primary border-primary/30 shadow-sm'
          : 'bg-card/70 text-muted-foreground border-border hover:text-foreground hover:bg-muted'
      } ${className}`}
      aria-label={saved ? `Remove ${item.title} from saved` : `Save ${item.title}`}
      title={saved ? 'Remove from saved' : 'Save for later'}
    >
      <Bookmark
        className={`${iconClass} ${saved ? 'fill-primary' : 'fill-none'}`}
        aria-hidden="true"
      />
    </button>
  );
};
