import { ClientColors } from '@constants/ClientPreferences'
import errorMessage from '@helpers/errorMessage'
import BaseClient from '@structures/BaseClient'
import BaseCommand, { CommandData, CommandSettings } from '@structures/BaseCommand'
import { GuildQueue, Track, useMainPlayer } from 'discord-player'
import { EmbedBuilder, Message, bold } from 'discord.js'

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

		if (!queue?.currentTrack || !tracks || !tracks.length) return errorMessage(msg, 'Հերթը դատարկ է')

		const queueTracks = tracks.map((track: Track, index: number) => {
			return `**${index + 1}.** [${track.title}](${track.url}), արտիստը ${track.author}`
		}).join('\n')

		const embed = new EmbedBuilder()
			.setAuthor({ name: 'Հիմա խաղում է', iconURL: queue.currentTrack.thumbnail })
			.setDescription(`[${queue.currentTrack.title}](${queue.currentTrack.url}), արտիստը ${queue.currentTrack.author}\n### Հերթ\n${queueTracks}`)
			.setFooter({ text: `Հերթի քանակ: ${queue?.tracks.size}` })
			.setColor(ClientColors.secondary)


		await msg.reply({ embeds: [embed] })
	}

	public static async addAction(queue: GuildQueue, track: Track) {
		const msg = queue.metadata as Message<true>

		const embed = new EmbedBuilder()
			.setAuthor({ name: 'Երգը ավելացվեց', iconURL: track.thumbnail })
			.setDescription(`[${bold(track.title)}](${track.url}), արտիստը ${bold(track.author)} \`${track.duration}\``)
			.setFooter({ text: `Պատվերը ${track.requestedBy?.displayName + '-ի' ?? 'անհայտ մարդու'} կողմից` })
			.setColor(ClientColors.secondary)
	
		await msg.channel.send({ embeds: [embed] })
	}
}