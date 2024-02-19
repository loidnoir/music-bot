import { ClientColors } from '@constants/ClientPreferences'
import errorMessage from '@helpers/errorMessage'
import BaseClient from '@structures/BaseClient'
import BaseCommand, { CommandData, CommandSettings } from '@structures/BaseCommand'
import { GuildQueue, Track, useQueue } from 'discord-player'
import { EmbedBuilder, Message } from 'discord.js'

export default class Skip extends BaseCommand {
	public data: CommandData = {
		name: 'skip',
		aliases: ['s', 'sikp', 'sik']
		
	}

	public settings: CommandSettings = {
		cooldown: 1,
		djOnly: true
	}
    
	public async run(client: BaseClient, msg: Message<true>): Promise<void> {
		const [rawAmount] = msg.content.split(' ').slice(1)
		const queue = useQueue(msg.guildId)
		const amount = parseInt(rawAmount) ?? 1

		console.log(amount)

		if (amount > 1) {
			const tracks = queue?.tracks.toArray()
			
			if (!tracks) return errorMessage(msg, 'Հերթը դատարկ է')
			
			queue?.node.skipTo(tracks[amount - 1].id)
		}

		else {
			queue?.node.skip()
		}
	}

	public static async skipAction(queue: GuildQueue, track: Track) {
		const msg = queue.metadata as Message<true>

		const embed = new EmbedBuilder()
			// .setAuthor({ name: 'Երգը անցանք', iconURL: track.thumbnail })
			// .setDescription(`[${bold(track.title)}](${track.url}), արտիստ ${bold(track.author)} երգը փոխվեց`)
			// .setFooter({ text: `Պատվերը ${track.requestedBy?.displayName}-ի կողմից` })
			.setDescription('Փոխում ենք...')
			.setColor(ClientColors.action)
			
		await msg.channel.send({ embeds: [embed] })
	}
}