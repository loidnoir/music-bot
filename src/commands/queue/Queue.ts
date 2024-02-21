import errorMessage from '@helpers/errorMessage'
import playerMessage, { queueMessage } from '@helpers/playerMessage'
import useChannel from '@helpers/useChannel'
import BaseClient from '@structures/BaseClient'
import BaseCommand, { CommandData, CommandSettings } from '@structures/BaseCommand'
import { GuildQueue, Track, useMainPlayer } from 'discord-player'
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, Message, MessageActionRowComponentBuilder } from 'discord.js'

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
		const tracks = queue?.tracks.toArray().slice(0, 10)
		const channel = useChannel(msg.guild, msg.author.id)
		
		if (queue?.channel?.id	!= channel?.id) return errorMessage(msg, 'Դուք չեք գտնվում ինձ հետ նույն ալիքում')
		if (!queue?.currentTrack || !tracks || !tracks.length) return errorMessage(msg, 'Ցանկը դատարկ է')
		
		Queue.getPage(msg, 1, false)
	}
	
	public static async getPage(msg: Message<true>, page: number, edit: boolean = false) {
		const perPage = 10
		const player = useMainPlayer()
		const queue = player.queues.get(msg.guildId)
		
		if (!queue || !queue.currentTrack) return
		
		const allTracks = queue?.tracks.toArray() ?? []
		const tracks = allTracks.slice((page - 1) * perPage, page * perPage)
		const maxPage = Math.ceil(allTracks.length / perPage)

		if (tracks.length == 0) return

		const buttons = [
			new ButtonBuilder().setCustomId(`queue-prev-${page}-${maxPage}`).setEmoji('⬅').setStyle(ButtonStyle.Secondary).setLabel('Հետ գնալ'),
			new ButtonBuilder().setCustomId(`queue-next-${page}-${maxPage}`).setEmoji('➡️').setStyle(ButtonStyle.Secondary).setLabel('Առաջ գնալ')
		]

		const actionRow = new ActionRowBuilder<MessageActionRowComponentBuilder>()
			.addComponents(buttons)

		edit ? queueMessage(msg, queue.currentTrack, queue, tracks, { edit: true, actionRow: actionRow, perPage, page, maxPage }) : queueMessage(msg, queue.currentTrack, queue, tracks, { actionRow: actionRow, page, perPage, maxPage })
	}

	public static async addAction(queue: GuildQueue, track: Track) {
		const msg = queue.metadata as Message<true>

		if (queue.tracks.size === 1) return

		playerMessage(msg, track, 'Ավելացվեծ ցանկ')
	}
}