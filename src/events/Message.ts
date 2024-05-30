import getPrefix from '@actions/getPrefix'
import sendError from '@actions/sendError'
import Client from '@structures/Client'
import Command from '@structures/Command'
import Event from '@structures/Event'

import { ClientEvents, Message as DiscordMessage } from 'discord.js'
export default class extends Event {
	public name: keyof ClientEvents = 'messageCreate'
	public once: boolean = false
	public client: Client

	constructor(client: Client) {
		super()
		this.client = client
	}

	public async execute(msg: DiscordMessage): Promise<void> {
		if (!msg.inGuild()) return

		const prefix = await getPrefix(this.client, msg)

		if (!msg.content.startsWith(prefix) || msg.author.bot) return

		const params = msg.content.slice(prefix.length).trim().split(' ')

		if (!params.length) {
			sendError(msg, 'noParams')
			return
		}

		const commandName = params[0].toLowerCase()
		const command = this.client.commands
			.filter((comamnd: Command) => comamnd.name.includes(commandName))
			.first()

		if (!command) {
			sendError(msg, 'wrongCommand')
			return
		}

		const args = command.loadArgs(
			params.slice(1).filter((param) => !param.startsWith('--')),
		)
		const flags = command.loadFlags(
			params.slice(1).filter((param) => param.startsWith('--')),
		)

		command.execute(msg, args, flags)
	}
}
