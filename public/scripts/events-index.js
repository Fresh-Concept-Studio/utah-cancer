// Intentionally empty. The Events page's Upcoming/Recently Past split and category filters
// now ship as a bundled script from src/views/events-index.astro, so the browser and the build
// share the date rules in src/lib/event-dates.ts.
//
// This file remains because the published Sanity page settings for events/index.html still list
// /scripts/events-index.js. Remove it from those settings first, then this file can be deleted.
