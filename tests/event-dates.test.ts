import test from 'node:test';
import assert from 'node:assert/strict';
import {eventDateKey, formatEventDate, isEventPast, parseMonth, parseWrittenDate, todayKey} from '../src/lib/event-dates.ts';

test('month abbreviations and full names parse in any case', () => {
  assert.equal(parseMonth('OCT'), 10);
  assert.equal(parseMonth('oct'), 10);
  assert.equal(parseMonth('Oct.'), 10);
  assert.equal(parseMonth('October'), 10);
  assert.equal(parseMonth(' SEPTEMBER '), 9);
  assert.equal(parseMonth('Sept'), 9);
  assert.equal(parseMonth('may'), 5);
  assert.equal(parseMonth('Jun'), 6);
  assert.equal(parseMonth('Ju'), null, 'too short to tell June from July');
  assert.equal(parseMonth('Octember'), null);
  assert.equal(parseMonth(''), null);
  assert.equal(parseMonth(undefined), null);
});

test('month/day/year fields become a calendar date key, and impossible dates are rejected', () => {
  assert.equal(eventDateKey('OCT', '10', '2026'), '2026-10-10');
  assert.equal(eventDateKey('nov', ' 6 ', '2026'), '2026-11-06');
  assert.equal(eventDateKey('February', '29', '2028'), '2028-02-29');
  assert.equal(eventDateKey('February', '29', '2027'), null);
  assert.equal(eventDateKey('SEP', '31', '2026'), null);
  assert.equal(eventDateKey('SEP', 'TBD', '2026'), null);
  assert.equal(eventDateKey('SEP', '26', ''), null);
  assert.equal(eventDateKey('Fall', '26', '2026'), null);
});

test('written dates ignore the weekday and read the month, day, and year', () => {
  assert.equal(parseWrittenDate('Saturday, September 26, 2026'), '2026-09-26');
  assert.equal(parseWrittenDate('Sat. Sept. 26th 2026'), '2026-09-26');
  assert.equal(parseWrittenDate('October 3, 2026 · 9 AM'), '2026-10-03');
  assert.equal(parseWrittenDate('Date to be announced'), null);
});

test('today is the calendar day in Denver, not in UTC or the server zone', () => {
  // 03:30 UTC on Oct 11 is still 21:30 on Oct 10 in Denver (MDT, UTC-6).
  assert.equal(todayKey(new Date('2026-10-11T03:30:00Z')), '2026-10-10');
  assert.equal(todayKey(new Date('2026-10-11T06:00:00Z')), '2026-10-11');
  // Winter (MST, UTC-7): 06:59 UTC on Nov 27 is 23:59 on Nov 26 in Denver.
  assert.equal(todayKey(new Date('2026-11-27T06:59:00Z')), '2026-11-26');
  assert.equal(todayKey(new Date('2026-11-27T07:00:00Z')), '2026-11-27');
});

test('an event stays upcoming for its whole day in Denver and becomes past the next Denver day', () => {
  const event = '2026-10-10';
  assert.equal(isEventPast(event, todayKey(new Date('2026-10-09T23:00:00Z'))), false, 'day before');
  assert.equal(isEventPast(event, todayKey(new Date('2026-10-10T06:00:00Z'))), false, 'event day, just after midnight in Denver');
  assert.equal(isEventPast(event, todayKey(new Date('2026-10-11T05:59:59Z'))), false, 'already Oct 11 in UTC, still the event day in Denver');
  assert.equal(isEventPast(event, todayKey(new Date('2026-10-11T06:00:00Z'))), true, 'midnight starting Oct 11 in Denver');
  assert.equal(isEventPast(event, '2027-01-01'), true);
  assert.equal(isEventPast('2026-12-31', '2027-01-01'), true, 'year boundary');
});

test('events without a readable date never become past', () => {
  assert.equal(isEventPast(null, '2030-01-01'), false);
  assert.equal(isEventPast('', '2030-01-01'), false);
  assert.equal(isEventPast('SEP 26', '2030-01-01'), false);
});

test('past cards show the date written out in full', () => {
  assert.equal(formatEventDate('2026-10-17'), 'October 17, 2026');
  assert.equal(formatEventDate('2026-09-05'), 'September 5, 2026');
});
