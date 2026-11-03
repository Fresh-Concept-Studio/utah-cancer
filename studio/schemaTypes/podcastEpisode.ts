import {defineField, defineType} from 'sanity'

const platformUrl = (hosts: string[]) => (r: any) => r.uri({scheme: ['https']}).custom((value?: string) =>
  !value || hosts.some(host => new URL(value).hostname.endsWith(host)) ? true : `Use a link from ${hosts[0]}.`)

export const podcastEpisode = defineType({
  name: 'podcastEpisode', title: 'Podcast episode', type: 'document',
  description: 'Each published episode appears in the Here With You podcast section on the homepage, newest first. Unpublish or delete an episode to remove it.',
  fields: [
    defineField({name: 'title', title: 'Episode title', type: 'string', validation: r => r.required()}),
    defineField({name: 'guest', title: 'Guest', type: 'string', description: 'For example, Dr. Graydon Harker.'}),
    defineField({name: 'episodeNumber', title: 'Episode number', type: 'number', validation: r => r.integer().min(1)}),
    defineField({name: 'publishedDate', title: 'Release date', type: 'date', description: 'Episodes are listed newest first by this date.', validation: r => r.required()}),
    defineField({name: 'youtubeUrl', title: 'YouTube link', type: 'url', description: 'The episode’s video, for example https://www.youtube.com/watch?v=…', validation: platformUrl(['youtube.com', 'youtu.be'])}),
    defineField({name: 'spotifyUrl', title: 'Spotify link', type: 'url', description: 'The episode page, for example https://open.spotify.com/episode/…', validation: platformUrl(['spotify.com'])}),
    defineField({name: 'appleUrl', title: 'Apple Podcasts link', type: 'url', description: 'The episode page, for example https://podcasts.apple.com/us/podcast/…', validation: platformUrl(['podcasts.apple.com'])}),
  ],
  orderings: [{title: 'Release date, newest first', name: 'releaseDesc', by: [{field: 'publishedDate', direction: 'desc'}]}],
  preview: {select: {title: 'title', guest: 'guest', number: 'episodeNumber', date: 'publishedDate'}, prepare: ({title, guest, number, date}) => ({title, subtitle: [number && `Episode ${number}`, guest, date].filter(Boolean).join(' · ')})},
})
