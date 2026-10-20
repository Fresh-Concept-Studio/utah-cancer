// Shared by the Events page build (src/views/events-index.astro) and its browser script,
// so both decide "upcoming" vs "past" the same way.
//
// Dates are calendar days written as "YYYY-MM-DD" keys. Keys compare correctly as strings,
// and they avoid any clock or timezone arithmetic: an event is past once the current
// calendar day in Denver is later than the event's day.

export const EVENT_TIME_ZONE = 'America/Denver';

const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

/** Month number (1-12) from an abbreviation or full name, any case ("OCT", "Sept.", "october"). */
export function parseMonth(value: string | undefined | null): number | null {
  const word = String(value ?? '').trim().replace(/\.$/, '').toLowerCase();
  if (word.length < 3 || !/^[a-z]+$/.test(word)) return null;
  const index = MONTH_NAMES.findIndex(name => name.toLowerCase().startsWith(word));
  return index === -1 ? null : index + 1;
}

function pad(value: number): string {
  return String(value).padStart(2, '0');
}

/** "YYYY-MM-DD" from separate month/day/year text, or null when they don't form a real date. */
export function eventDateKey(month: string | undefined | null, day: string | number | undefined | null, year: string | number | undefined | null): string | null {
  const monthNumber = parseMonth(month);
  const dayText = String(day ?? '').trim();
  const yearText = String(year ?? '').trim();
  if (!monthNumber || !/^\d{1,2}$/.test(dayText) || !/^\d{4}$/.test(yearText)) return null;
  const dayNumber = Number(dayText);
  const yearNumber = Number(yearText);
  const daysInMonth = new Date(Date.UTC(yearNumber, monthNumber, 0)).getUTCDate();
  if (dayNumber < 1 || dayNumber > daysInMonth) return null;
  return `${yearNumber}-${pad(monthNumber)}-${pad(dayNumber)}`;
}

/** "YYYY-MM-DD" from written dates such as "Saturday, September 26, 2026" or "Sept. 26 2026". */
export function parseWrittenDate(text: string | undefined | null): string | null {
  for (const match of String(text ?? '').matchAll(/([A-Za-z]+)\.?\s+(\d{1,2})(?:st|nd|rd|th)?,?\s+(\d{4})\b/g)) {
    const key = eventDateKey(match[1], match[2], match[3]);
    if (key) return key;
  }
  return null;
}

/** Today's calendar day in Denver (or another zone) as "YYYY-MM-DD", for any instant. */
export function todayKey(now: Date = new Date(), timeZone: string = EVENT_TIME_ZONE): string {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat('en-US', {timeZone, year: 'numeric', month: '2-digit', day: '2-digit'})
      .formatToParts(now)
      .map(part => [part.type, part.value]),
  );
  return `${parts.year}-${parts.month}-${parts.day}`;
}

/** True from the day after the event (in Denver). The event day itself still counts as upcoming. */
export function isEventPast(eventKey: string | undefined | null, today: string = todayKey()): boolean {
  return Boolean(eventKey && /^\d{4}-\d{2}-\d{2}$/.test(eventKey) && eventKey < today);
}

/** "October 17, 2026" from a "YYYY-MM-DD" key. */
export function formatEventDate(eventKey: string): string {
  const [year, month, day] = eventKey.split('-').map(Number);
  return `${MONTH_NAMES[month - 1]} ${day}, ${year}`;
}
