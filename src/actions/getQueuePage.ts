import { Track, useQueue } from 'discord-player'

export default function (guildId: string, page: number): [Track[], number] {
	const queue = useQueue(guildId)
	const allTracks = queue?.tracks.toArray() ?? []
	const perPage = 10

	if (!allTracks.length) return [[], 0]

	const tracks = allTracks.slice((page - 1) * perPage, page * perPage)
	const maxPage = Math.ceil(allTracks.length / perPage)

	return [tracks, maxPage]
}
