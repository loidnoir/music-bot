import errorMessage from '@helpers/errorMessage'
import useChannel from '@helpers/useChannel'
import BaseClient from '@structures/BaseClient'
import BaseCommand, { CommandData, CommandSettings } from '@structures/BaseCommand'
import { useQueue, useTimeline } from 'discord-player'
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

	public async run(client: BaseClient, msg: Message<true>): Promise<void> {
		const player = useTimeline(msg.guildId)
		const queue = useQueue(msg.guildId)
		const channel = useChannel(msg.guild, msg.author.id)

		if (queue?.channel?.id	!= channel?.id) return errorMessage(msg, 'Դուք չեք գտնվում ինձ հետ նույն ալիքում')
		if (!player?.track) return errorMessage(msg, 'Ներկա պահին ոչ մի երգ չի խաղում')
		if (player.paused) return errorMessage(msg, 'Երգը արդեն կանգնված է')

		player.pause()

		msg.react('⏸️')
	}
}