import { ButtonStyle } from 'discord.js'

export default class {
	public id: string
	public label: string
	public style: ButtonStyle
	public emoji?: symbol

	constructor(id: string, label: string, style?: ButtonStyle, emoji?: symbol) {
		this.id = id
		this.label = label
		this.style = style ?? ButtonStyle.Secondary
		this.emoji = emoji
	}
}
