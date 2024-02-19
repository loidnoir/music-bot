import errorMessage from '@helpers/errorMessage'
import BaseClient from '@structures/BaseClient'
import BaseCommand, { CommandData, CommandSettings } from '@structures/BaseCommand'
import GuildModel from '@structures/GuildModel'
import { Message } from 'discord.js'

export default class SetDJ extends BaseCommand {
	public data: CommandData = {
		name: 'setdj',
		aliases: ['sdj']
	}

	public settings: CommandSettings = {
		cooldown: 5,
		modOnly: true
	}
    
	public async run(client: BaseClient, msg: Message<true>): Promise<void> {
		const role = msg.mentions.roles.first()
		const rawRole = msg.content.split(' ')[1]
		const guildModel = await GuildModel.cache(client, msg.guild.id)

		if (!role) {
			if (!rawRole) return errorMessage(msg, 'Դուք չեք նշել դերը')

			if (rawRole === 'disable') {
				guildModel.data.djSystem = false
				await GuildModel.save(client, msg.guildId)
			}
			
			else {
				const role = await msg.guild.roles.fetch(rawRole)

				if (role) {
					guildModel.data.djRole = role.id
					guildModel.data.djSystem = true
					await GuildModel.save(client, msg.guildId)
				}

				else {
					errorMessage(msg, 'Սխալ դերի ID')
					return
				}
			}
		}
		
		else {
			guildModel.data.djRole = role.id
			guildModel.data.djSystem = true
			await GuildModel.save(client, msg.guildId)
		}

		await GuildModel.save(client, msg.guildId)

		msg.react('👌')
	}
}