import errorMessage from '@helpers/errorMessage'
import BaseClient from '@structures/BaseClient'
import BaseCommand, { CommandData, CommandSettings } from '@structures/BaseCommand'
import GuildModel from '@structures/GuildModel'
import { Message } from 'discord.js'

export default class SetPrefix extends BaseCommand {
	public data: CommandData = {
		name: 'setprefix',
		aliases: ['stp']
	}

	public settings: CommandSettings = {
		cooldown: 5,
		modOnly: true
	}
    
	public async run(client: BaseClient, msg: Message<true>): Promise<void> {
		const prefix = msg.content.split(' ')[1]
		const guildModel = await GuildModel.cache(client, msg.guild.id)

		if (!prefix) return errorMessage(msg, 'Դուք չեք նշել prefix-ը')

		guildModel.data.prefix = prefix
        
		await GuildModel.save(client, msg.guildId)

		msg.react('👌')
	}
}