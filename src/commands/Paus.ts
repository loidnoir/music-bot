import errorMessage from '@helpers/errorMessage'
import BaseClient from '@structures/BaseClient'
import BaseCommand, { CommandData, CommandSettings } from '@structures/BaseCommand'
import { useTimeline } from 'discord-player'
import { Message } from 'discord.js'

export default class Pause extends BaseCommand {
	public data: CommandData = {
		name: 'pause',
		aliases: ['ps']
	}
    
	public settings: CommandSettings = {
		cooldown: 1,
		djOnly: true
	}

	public run(client: BaseClient, msg: Message<true>): void {
		const player = useTimeline(msg.guildId)

		if (!player?.track) return errorMessage(msg, 'Ներկա պահին ոչ մի երգ չի խաղում')
		if (player.paused) return errorMessage(msg, 'Երգը արդեն կանգնված է')

		player.pause()

		msg.react('⏸️')
	}
}