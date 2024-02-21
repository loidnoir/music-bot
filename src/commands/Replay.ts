import errorMessage from '@helpers/errorMessage'
import BaseClient from '@structures/BaseClient'
import BaseCommand, { CommandData, CommandSettings } from '@structures/BaseCommand'
import { useTimeline } from 'discord-player'
import { Message } from 'discord.js'

export default class Replay extends BaseCommand {
	public data: CommandData = {
		name: 'replay',
		aliases: ['rp']
	}

	public settings: CommandSettings = {
		cooldown: 1,
		djOnly: true
	}

	public run(client: BaseClient, msg: Message<true>): void {
		const timeline = useTimeline(msg.guildId)

		if (!timeline || !timeline.track) return errorMessage(msg, 'Ներկա պահին ոչ մի երաժշտություն չի խաղում')

		timeline?.setPosition(0)
	}
}