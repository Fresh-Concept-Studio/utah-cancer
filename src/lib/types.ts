export interface ContentLink { attrs: { href: string; [attribute: string]: string | undefined }; html: string }
export interface ContentSection { id?: string; title: string; html: string }
export interface Tab { href: string; label: string }
export interface PageData {
  title: string;
  description?: string;
  bodyClass?: string;
  mainLandmark?: boolean;
  styles: string[];
  scripts: string[];
  marquee?: boolean;
  activeNav?: string[];
  family?: 'provider' | 'leader' | 'specialty' | 'location';
  slug?: string;
  component?: string;
  heading?: string;
  eyebrow?: string;
  contentHtml?: string;
  intro?: string;
  resourceIcon?: string;
  relatedLinks?: { href: string; label: string }[];
  sourceUrl?: string;
  sourceTextHash?: string;
  publishedDate?: string;
  dateLabel?: string;
  excerpt?: string;
  socialImage?: string;
  schemaType?: 'WebPage' | 'NewsArticle';
  redirect?: string;
  redirectBody?: string;
  cta?: { heading: string; image?: string; links: ContentLink[]; actionsClass?: string };
}
