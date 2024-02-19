import { ClientColors } from '@constants/ClientPreferences'
import BaseClient from '@structures/BaseClient'
import BaseCommand, { CommandData, CommandSettings } from '@structures/BaseCommand'
import GuildModel from '@structures/GuildModel'
import { EmbedBuilder, Message, roleMention } from 'discord.js'

export default class Help extends BaseCommand {
	public data: CommandData = {
		name: 'help',
		aliases: ['h']

	}

	public settings: CommandSettings = {
		cooldown: 0
	}

	public async run(client: BaseClient, msg: Message<true>): Promise<void> {
		const guildModel = await GuildModel.cache(client, msg.guildId)
		const prefix = guildModel.data.prefix

		const content =
			`- DJ \`${prefix}setdj [@role, disable]\` ${guildModel.data?.djRole ? roleMention(guildModel.data.djRole) : ''}\n` +
			`- Prefix \`${prefix}setprefix [prefix]\``

		const embed = new EmbedBuilder()
			.setColor(ClientColors.secondary)
			.setAuthor({ name: 'Հաճախ չտրվող հարցեր', iconURL: client.user?.displayAvatarURL() })
			.setDescription(content)

		await msg.channel.send({ embeds: [embed] })
	}
}