import errorMessage from '@helpers/errorMessage'
import BaseClient from '@structures/BaseClient'
import BaseCommand, { CommandData, CommandSettings } from '@structures/BaseCommand'
import GuildModel from '@structures/GuildModel'
import { useQueue } from 'discord-player'
import { Message } from 'discord.js'

export default class Loop extends BaseCommand {
	public data: CommandData = {
		name: 'loop',
		aliases: ['l'],
		params: ['--track', '--queue', '--autoplay', '--t', '--q', '--a']
	}
    
	public settings: CommandSettings = {
		cooldown: 1,
		djOnly: true
	}
    
	public async run(client: BaseClient, msg: Message<true>): Promise<void> {
		const params = msg.content.split(' ').slice(1).filter(one => one.startsWith('--'))
		const guildModel = await GuildModel.cache(client, msg.guildId)
		const queue = useQueue(msg.guildId)

		if (guildModel.loop) {
			queue?.setRepeatMode(0)
			guildModel.loop = false
		}

		else if (params.length == 0 || params.includes('--track') || params.includes('--t')) {
			queue?.setRepeatMode(1)
			guildModel.loop = true
		}

		else if (params.includes('--queue') || params.includes('--q')) {
			queue?.setRepeatMode(2)
			guildModel.loop = true
		}

		else if (params.includes('--autoplay') || params.includes('--a')) {
			queue?.setRepeatMode(3)
			guildModel.loop = true
		}

		else {
			errorMessage(msg, 'Նշված պարամետրերը անհայտ են')
			return
		}

		msg.react('👌')
	}
}