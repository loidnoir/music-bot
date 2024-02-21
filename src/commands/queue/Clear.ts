import errorMessage from '@helpers/errorMessage'
import BaseClient from '@structures/BaseClient'
import BaseCommand, { CommandData, CommandSettings } from '@structures/BaseCommand'
import { useQueue } from 'discord-player'
import { Message } from 'discord.js'

export default class Clear extends BaseCommand {
	public data: CommandData = {
		name: 'clear',
		aliases: ['c']
	}

	public settings: CommandSettings = {
		cooldown: 1,
		djOnly: true
	}

	public run(client: BaseClient, msg: Message<true>): void {
		const queue = useQueue(msg.guildId)

		if (!queue || queue.tracks.toArray().length == 0) return errorMessage(msg, 'Երգերի հերթը դատարկ է')

		queue?.clear()

		msg.react('🗑️')
	}
}