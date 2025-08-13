export function cls(...a) {
  return a.filter(Boolean).join(' ');
}

import { useEffect, useState } from 'react';

export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {}
  }, [key, value]);
  return [value, setValue];
}

export function round(n, dp = 2) {
  if (n === null || n === undefined || Number.isNaN(n)) return '-';
  const f = Math.pow(10, dp);
  return Math.round((n + Number.EPSILON) * f) / f;
}

export async function copyToClipboard(text) {
  if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      /* fall through to legacy method */
    }
  }
  try {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.left = '-9999px';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    return true;
  } catch {
    return false;
  }
}
