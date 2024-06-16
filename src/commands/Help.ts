import getPrefix from '@actions/getPrefix'
import clientColors from '@constants/clientColors'
import Client from '@structures/Client'
import Command from '@structures/Command'
import { EmbedBuilder, Message } from 'discord.js'

export default class extends Command {
	public client: Client
	public description?: string | undefined
	public name: string[] = ['help', 'h']

	constructor(client: Client) {
		super()
		this.client = client
	}

	public async execute(
		msg: Message<true>,
		args: unknown,
		flags: HelpFlags,
	): Promise<void> {
		const embed = new EmbedBuilder().setColor(clientColors.information)

		if (flags.list) {
			const prefix = await getPrefix(this.client, msg)

			embed
				.setAuthor({
					name: 'Հրամանների ցանկ',
					iconURL: this.client.user?.displayAvatarURL(),
				})
				.setDescription(
					`${this.client.commands
						.map((command) => {
							return `- ${prefix}${command.name[0]} ${command.name.length > 1 ? `\`${command.name.slice(1).join(', ')}\`` : ''}`
						})
						.join('\n')}`,
				)
		} else {
			embed
				.setAuthor({ name: 'Օգնություն' })
				.setDescription(
					'Բոտի տեր տիրակալ Loid\n- Հարցերի դեպքում Loid-ին\n- Օգնության համար Loid-ին\n- Վատ կարցիք չի ընդունվում\n- Kanye-ն լոխա\n- Հրամանների համար -h --l',
				)
		}

		msg.channel.send({ embeds: [embed] })
	}
	public loadArgs(args: string[]): unknown {
		return {}
	}
	public loadFlags(flags: string[]): HelpFlags {
		return {
			list: flags.includes('--list') || flags.includes('--l'),
		}
	}
}

interface HelpFlags {
	list: boolean
}
