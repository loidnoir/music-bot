import BaseEvent, { EventData } from '@structures/BaseEvent'
import BaseClient from '@structures/BaseClient'
import { Message, bold } from 'discord.js'
import GuildModel from '@structures/GuildModel'
import errorMessage from '@helpers/errorMessage'


export default class MessageEvent extends BaseEvent {
	public data: EventData = {
		name: 'messageCreate',
		once: false
	}

	public async run(client: BaseClient, msg: Message<true>): Promise<void> {
		const guildMdel = await GuildModel.cache(client, msg.guild.id)
		const prefix = guildMdel.data.prefix

		if (!msg.content.startsWith(prefix) || msg.author.bot) return

		const args = msg.content.slice(prefix.length).trim().split(' ')

		if (!args.length) return

		const commandName = args[0]
		const command = client.commands.get(commandName) ?? client.commands.find(cmd => cmd.data.aliases && cmd.data.aliases.includes(commandName))

		if (!command) return

		const cooldown = client.cooldown.get(`${msg.author.id}-${command.data.name}`)

		if (cooldown && cooldown.getTime() > Date.now()) {
			const timeLeft = (cooldown.getTime() - Date.now()) / 1000
			return errorMessage(msg, `Կխնդրեմ միքիչ դանդաղ, փորձեք նորից ${bold(timeLeft.toFixed(1))} վայրկյանից`)
		}

		else {
			if (command.settings.cooldown > 0) {
				client.cooldown.set(`${msg.author.id}-${command.data.name}`, new Date(Date.now() + command.settings.cooldown * 1000))
			}
		}

		if (command.settings.djOnly && guildMdel.data.djSystem) {
			if (!guildMdel.data.djRole) return errorMessage(msg, 'DJ դերը չի սահմանված չնայած նրան, որ սերվերում միացված է DJonly մոդը')
			if (!msg.member?.roles.cache.has(guildMdel.data.djRole)) return	errorMessage(msg, 'Դուք չունեք DJ դերը')
		}

		if (command.settings.modOnly && !msg.member?.permissions.has('ManageGuild')) {
			return errorMessage(msg, `Դուք չունեք ${bold('ManageRole')} արտոնություն, որը հարկավոր է ներկա հրամանի օգտագործման համար`)
		}

		command.run(client, msg)
	}
}