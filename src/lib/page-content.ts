import defaults from '../data/page-content.json';
import type {PageData} from './types';

export function pageEditor(page: PageData) {
  const fallback = (defaults as Record<string, any>)[page.component || ''] || {};
  const content = new Map((page.editorContent || fallback.editorContent || []).map((item: any) => [item.key || item._key, item.value]));
  const images = new Map((page.editorImages || fallback.editorImages || []).map((item: any) => [item.key || item._key, item.image]));
  return {
    number: (key: string, original: number): number => { const value=content.get(key); const parsed=Number(value); return value !== undefined && String(value).trim() && Number.isFinite(parsed) && parsed >= 0 ? parsed : original; },
    text: (key: string, original: string): string => (content.get(key) as string | undefined) ?? original,
    image: (key: string, original: string): string => (images.get(key) as any)?.src || original,
    imageAlt: (key: string, original: string): string => (images.get(key) as any)?.alt ?? original,
    imageChanged: (key: string, original: string): boolean => Boolean((images.get(key) as any)?.src && (images.get(key) as any).src !== original),
  };
}
