import errorMessage from '@helpers/errorMessage'
import { skipMessage } from '@helpers/playerMessage'
import useChannel from '@helpers/useChannel'
import BaseClient from '@structures/BaseClient'
import BaseCommand, { CommandData, CommandSettings } from '@structures/BaseCommand'
import { GuildQueue, Track, useQueue } from 'discord-player'
import { Message } from 'discord.js'

export default class Skip extends BaseCommand {
	public data: CommandData = {
		name: 'skip',
		aliases: ['s', 'sikp', 'sik'],
		args: ['amount']
		
	}

	public settings: CommandSettings = {
		cooldown: 1,
		djOnly: true
	}
    
	public async run(client: BaseClient, msg: Message<true>): Promise<void> {
		const [rawAmount] = msg.content.split(' ').slice(1)
		const queue = useQueue(msg.guildId)
		const amount = parseInt(rawAmount) ?? 1
		const channel = useChannel(msg.guild, msg.author.id)

		if (queue?.channel?.id	!= channel?.id) return errorMessage(msg, 'Դուք չեք գտնվում ինձ հետ նույն ալիքում')

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

		skipMessage(msg)
	}
}