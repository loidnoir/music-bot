import errorMessage from '@helpers/errorMessage'
import BaseClient from '@structures/BaseClient'
import BaseCommand, { CommandData, CommandSettings } from '@structures/BaseCommand'
import { useQueue } from 'discord-player'
import { Message } from 'discord.js'

export default class Stop extends BaseCommand {
	public data: CommandData = {
		name: 'stop',
		aliases: ['st']
	}

	public settings: CommandSettings = {
		cooldown: 1,
		djOnly: true
	}

	public run(client: BaseClient, msg: Message<true>): void {
		const queue = useQueue(msg.guildId)

		if (!queue) return errorMessage(msg, 'Ներկա պահին ցանկը դատարկ է')

		queue?.node.stop()
		msg.react('❌')
	}
}