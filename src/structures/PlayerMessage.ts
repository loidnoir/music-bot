import replacePlaceholders from '@actions/replacePlaceholders'
import playerMessages from '@constants/playerMessages'
import { EmbedBuilder, Message } from 'discord.js'

export default class PlayerMessage {
	public type: keyof typeof playerMessages
	public descriptionVariables: (string | undefined)[]
	public footerVariabls: (string | undefined)[]

	constructor(type: keyof typeof playerMessages, descriptionVariables: (string | undefined)[], footerVariabls: (string | undefined)[]) {
		this.type = type
		this.descriptionVariables = descriptionVariables
		this.footerVariabls = footerVariabls
	}

	public sendMessage(msg: Message<true>, images?: PlayerMessageImages) {
		const data = playerMessages[this.type]

		const embed = new EmbedBuilder()
			.setAuthor({ name: data.author, iconURL: images?.author })
			.setColor(data.color)
			.setDescription(replacePlaceholders(data.description, ...this.descriptionVariables))

		if (data.footer) {
			embed.setFooter({ text: replacePlaceholders(data.footer, ...this.footerVariabls), iconURL: images?.footer })
		}

		return msg.channel.send({ embeds: [embed.data] })
	}
}

interface PlayerMessageImages {
    author?: string,
    footer?: string
}