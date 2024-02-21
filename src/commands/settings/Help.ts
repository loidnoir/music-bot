import { ClientColors } from '@constants/ClientPreferences'
import errorMessage from '@helpers/errorMessage'
import BaseClient from '@structures/BaseClient'
import BaseCommand, { CommandData, CommandSettings } from '@structures/BaseCommand'
import GuildModel from '@structures/GuildModel'
import { EmbedBuilder, Message } from 'discord.js'

export default class Help extends BaseCommand {
	public data: CommandData = {
		name: 'help',
		aliases: ['h'],
		args: ['command'],
		params: ['--list', '--l']
	}

	public settings: CommandSettings = {
		cooldown: 0
	}

	public async run(client: BaseClient, msg: Message<true>): Promise<void> {
		const guildModel = await GuildModel.cache(client, msg.guildId)
		const prefix = guildModel.data.prefix
		const params = msg.content.split(' ').filter(one => one.startsWith('--'))
		const commandName = msg.content.split(' ').slice(1)[0]
		
		const embed = new EmbedBuilder()
			.setColor(ClientColors.secondary)
		
		if (commandName) {
			const command = client.commands.get(commandName) ?? client.commands.find((cmd) => cmd.data.aliases.includes(commandName))

			if (!command) return errorMessage(msg, 'Այդպիսի հրաման գոյություն չունի')

			embed
				.setAuthor({ name: command.data.name })
				.addFields([
					{
						name: 'Aliases',
						value: command.data.aliases.map(alias => prefix + alias).join('\n') || 'Չկա',
						inline: true
					},
					{
						name: 'Arguments',
						value: command.data.args?.join('\n') || 'Չկա',
						inline: true
					},
					{
						name: 'Parameters',
						value: command.data.params?.join('\n') || 'Չկա',
						inline: true
					}
				])
				.setFooter({ text: `Cooldown ${command.settings.cooldown} վայրկյան` })
		}

		else if (params.includes('--list') || params.includes('--l')) {
			embed.setDescription(client.commands.map(command => `${prefix}${command.data.name}`).join('\n'))
		}

		else {
			embed
				.setAuthor({ name: 'Օգնություն' })
				.setDescription('Բոտի տեր տիրակալ Loid\n- Հարցերի դեպքում Loid-ին\n- Օգնության համար Loid-ին\n- Վատ կարցիք չի ընդունվում\n- Kanye-ն լոխա')
		}

		await msg.channel.send({ embeds: [embed] })
	}
}