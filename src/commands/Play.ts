import getVariables from '@actions/getVariables'
import sendError from '@actions/sendError'
import Client from '@structures/Client'
import Command from '@structures/Command'
import { useMainPlayer, useQueue } from 'discord-player'
import { Message } from 'discord.js'

export default class extends Command {
	public client: Client
	public name: string[] = ['play', 'p']

	constructor(client: Client) {
		super()
		this.client = client
	}

	public async execute(
		msg: Message<true>,
		args: PlayArgs,
		flags: PlayFlags,
	): Promise<void> {
		const channel = msg.member?.voice.channel

		if (!channel) {
			sendError(msg, 'noChannel')
			return
		}

		const player = useMainPlayer()
		let query = args.song

		if (flags.var) {
			const variables = await getVariables(this.client, msg)
			query =
				variables.find((variable) => variable.name == query)?.value ?? query
		}

		if (flags.force) {
			const queue = useQueue(msg.guildId)

			if (queue) {
				const track = await player.search(query, {
					requestedBy: msg.member,
				})

				if (track) {
					try {
						queue.addTrack(track.tracks[0])
						queue.swapTracks(0, track.tracks[0])
						queue.node.skip()
					} catch (error) {
						sendError(msg, 'songError')
					}
				}
			}
		} else {
			try {
				player.play(channel!, query, {
					requestedBy: msg.member,
					nodeOptions: {
						metadata: msg,
						leaveOnEmpty: true,
						leaveOnEmptyCooldown: 60000,
						leaveOnStop: true,
						leaveOnStopCooldown: 60000,
						leaveOnEnd: true,
						leaveOnEndCooldown: 60000,
						maxSize: 300,
						maxHistorySize: 300,
					},
				})
			} catch (error) {
				sendError(msg, 'songError')
				console.info(error)
			}
		}
	}

	public loadArgs(args: string[]): PlayArgs {
		return {
			song: args.join(' '),
		}
	}

	public loadFlags(flags: string[]): PlayFlags {
		return {
			force: flags.includes('--f'),
			var: flags.includes('--var') || flags.includes('--v'),
		}
	}
}

interface PlayArgs {
	song: string
}

interface PlayFlags {
	force: boolean
	var: boolean
}
