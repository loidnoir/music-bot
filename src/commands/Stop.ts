import errorMessage from '@helpers/errorMessage'
import useChannel from '@helpers/useChannel'
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
		const channel = useChannel(msg.guild, msg.author.id)

		if (queue?.channel?.id	!= channel?.id) return errorMessage(msg, 'Դուք չեք գտնվում ինձ հետ նույն ալիքում')
		if (!queue) return errorMessage(msg, 'Ներկա պահին ցանկը դատարկ է')

		queue?.node.stop()
		msg.react('❌')
	}
}