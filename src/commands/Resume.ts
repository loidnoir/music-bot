import errorMessage from '@helpers/errorMessage'
import BaseClient from '@structures/BaseClient'
import BaseCommand, { CommandData, CommandSettings } from '@structures/BaseCommand'
import { useTimeline } from 'discord-player'
import { Message } from 'discord.js'

export default class Resume extends BaseCommand {
	public data: CommandData = {
		name: 'resume',
		aliases: ['rs']
	}

	public settings: CommandSettings = {
		cooldown: 1,
		djOnly: true
	}

	public run(client: BaseClient, msg: Message<true>): void {
		const timeline = useTimeline(msg.guildId)

		if (!timeline?.track) return errorMessage(msg, 'Ներկա պահին ոչ մի երգ չկա որ միացնեմ')
		if (!timeline.paused) return errorMessage(msg, 'Երաժշտություն կանգնեցված չէ')

		timeline.resume()

		msg.react('▶️')
	}
}