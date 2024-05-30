import sendError from '@actions/sendError'
import clientEmojis from '@constants/clientEmojis'
import Client from '@structures/Client'
import Command from '@structures/Command'
import { useQueue } from 'discord-player'
import { Message } from 'discord.js'

export default class extends Command {
	public client: Client
	public name: string[] = ['boost', 'filter', 'f', 'bs']

	constructor(client: Client) {
		super()
		this.client = client
	}

	public async execute(
		msg: Message<true>,
		args: unknown,
		flags: BoostFlags,
	): Promise<void> {
		const channel = msg.member?.voice.channel

		if (!channel) {
			sendError(msg, 'noChannel')
			return
		}

		const queue = useQueue(msg.guildId)

		if (flags.bassboost) {
			queue?.filters.ffmpeg.setFilters([])
			queue?.filters.ffmpeg.toggle('bassboost_low')
		} else if (flags.eightD) {
			queue?.filters.ffmpeg.setFilters([])
			queue?.filters.ffmpeg.toggle('8D')
		} else if (flags.karaoke) {
			queue?.filters.ffmpeg.setFilters([])
			queue?.filters.ffmpeg.toggle('karaoke')
		} else if (flags.lofi) {
			queue?.filters.ffmpeg.setFilters([])
			queue?.filters.ffmpeg.toggle('lofi')
		} else if (flags.nightcore) {
			queue?.filters.ffmpeg.setFilters([])
			queue?.filters.ffmpeg.toggle('nightcore')
		} else if (flags.reverse) {
			queue?.filters.ffmpeg.setFilters([])
			queue?.filters.ffmpeg.toggle('reverse')
		} else if (flags.reset) {
			queue?.filters.ffmpeg.setFilters([])
		} else {
			msg.channel.send(
				`Հնարավոր ֆիլտրեր,\n${Object.keys(flags)
					.map((flag) => `- \`--${flag.replace('eightD', '8D')}\``)
					.join('\n')}`,
			)

			return
		}

		msg.react(clientEmojis.check)
	}

	public loadArgs(args: string[]): unknown {
		return {}
	}

	public loadFlags(flags: string[]): BoostFlags {
		return {
			bassboost: flags.includes('--bassboost'),
			lofi: flags.includes('--lofi'),
			karaoke: flags.includes('--karaoke'),
			nightcore: flags.includes('--nightcore'),
			reverse: flags.includes('--reverse'),
			eightD: flags.includes('--8d'),
			reset: flags.includes('--reset'),
		}
	}
}

interface BoostFlags {
	bassboost: boolean
	lofi: boolean
	karaoke: boolean
	nightcore: boolean
	reverse: boolean
	eightD: boolean
	reset: boolean
}
