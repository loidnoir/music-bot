import sendError from '@actions/sendError'
import Client from '@structures/Client'
import Command from '@structures/Command'
import { useQueue } from 'discord-player'
import { Message } from 'discord.js'

export default class extends Command {
	public client: Client
	public name: string[] = ['skip', 's']

	constructor(client: Client) {
		super()
		this.client = client
	}

	public execute(msg: Message<true>, args: SkipArgs, flags: unknown): void {
		const channel = msg.member?.voice.channel

		if (!channel) {
			sendError(msg, 'noChannel')
			return
		}

		const queue = useQueue(msg.guildId)

		if (args.count) {
			queue?.node.skipTo(args.count)
		} else {
			queue?.node.skip()
		}
	}

	public loadArgs(args: string[]): SkipArgs {
		return {
			count: parseInt(args[0]),
		}
	}

	public loadFlags(flags: string[]): unknown {
		return {}
	}
}

interface SkipArgs {
	count: number
}
