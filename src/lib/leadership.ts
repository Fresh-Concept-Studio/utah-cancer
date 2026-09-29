const collator = new Intl.Collator('en', {sensitivity: 'base', numeric: true});

/** Credentials follow a comma; generational suffixes are not surnames. */
export function leadershipLastName(name: string): string {
  const words = name.split(',')[0].trim().split(/\s+/);
  while (words.length > 1 && /^(?:jr\.?|sr\.?|ii|iii|iv)$/i.test(words.at(-1)!)) words.pop();
  return words.at(-1) || '';
}

/** Apply after resolving CMS profile references so new members are sorted too. */
export function sortLeadershipCards<T extends {name: string}>(title: string, cards: T[]): T[] {
  if (title.trim().toLowerCase() !== 'leadership') return cards;
  return [...cards].sort((a, b) => collator.compare(leadershipLastName(a.name), leadershipLastName(b.name)) || collator.compare(a.name, b.name));
}
