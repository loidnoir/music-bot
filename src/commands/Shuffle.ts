import errorMessage from '@helpers/errorMessage'
import BaseClient from '@structures/BaseClient'
import BaseCommand, { CommandData, CommandSettings } from '@structures/BaseCommand'
import { useQueue } from 'discord-player'
import { Message } from 'discord.js'

export default class Shuffle extends BaseCommand {
	public data: CommandData = {
		name: 'shuffle',
		aliases: ['sh']
	}

	public settings: CommandSettings = {
		cooldown: 3,
		djOnly: true
	}

	public run(client: BaseClient, msg: Message<true>): void {
		const queue = useQueue(msg.guildId)

		if (!queue || queue.isEmpty()) return errorMessage(msg, 'Ցանկը դատարկ է')

		if (queue.isShuffling) {
			queue.disableShuffle()
			console.log('Anjatvec')
		}
		
		else {
			console.log('Miacrec')
			queue.enableShuffle(true)
		}

		msg.react('🔀')
	}
}