import sendError from '@actions/sendError'
import clientEmojis from '@constants/clientEmojis'
import Client from '@structures/Client'
import Command from '@structures/Command'
import { useQueue } from 'discord-player'
import { Message } from 'discord.js'

export default class extends Command {
	public client: Client
	public name: string[] = ['shuffle', 'sh']

	constructor(client: Client) {
		super()
		this.client = client
	}

	public execute(msg: Message<true>, args: unknown, flags: unknown): void {
		const channel = msg.member?.voice.channel

		if (!channel) {
			sendError(msg, 'noChannel')
			return
		}

		const queue = useQueue(msg.guildId)

		if (queue?.isShuffling) {
			queue.disableShuffle()
			msg.react(clientEmojis.disable)
			return
		}

		queue?.enableShuffle(true)
		msg.react(clientEmojis.enable)
	}

	public loadArgs(args: string[]): unknown {
		return {}
	}

	public loadFlags(flags: string[]): unknown {
		return {}
	}
}
