import errorMessage from '@helpers/errorMessage'
import playerMessage, { queueMessage } from '@helpers/playerMessage'
import BaseClient from '@structures/BaseClient'
import BaseCommand, { CommandData, CommandSettings } from '@structures/BaseCommand'
import { GuildQueue, Track, useMainPlayer } from 'discord-player'
import { Message } from 'discord.js'

export default class Queue extends BaseCommand {
	public data: CommandData = {
		name: 'queue',
		aliases: ['q', 'ls']
	}
    
	public settings: CommandSettings = {
		cooldown: 1,
		djOnly: true
	}

	public async run(client: BaseClient, msg: Message<true>): Promise<void> {
		const player = useMainPlayer()
		const queue = player.queues.get(msg.guildId)
		const tracks = queue?.tracks.toArray().slice(0, 5)

		if (!queue?.currentTrack || !tracks || !tracks.length) return errorMessage(msg, 'Հերթը դատարկ է')

		queueMessage(msg, queue.currentTrack, queue, tracks)
	}

	public static async addAction(queue: GuildQueue, track: Track) {
		const msg = queue.metadata as Message<true>

		if (queue.tracks.size === 1) return

		playerMessage(msg, track, 'Երգը ավելացվեծ')
	}
}