import errorMessage from '@helpers/errorMessage'
import playerMessage from '@helpers/playerMessage'
import BaseClient from '@structures/BaseClient'
import BaseCommand, { CommandData, CommandSettings } from '@structures/BaseCommand'
import GuildModel from '@structures/GuildModel'
import { GuildQueue, Track, useMainPlayer, useQueue } from 'discord-player'
import { Message } from 'discord.js'

export default class Play extends BaseCommand {
	public data: CommandData = {
		name: 'play',
		aliases: ['p', 'ergi'],
		args: ['song/url'],
		params: ['--force', '--f', '--no-var', '--nv']
	}
    
	public settings: CommandSettings = {
		cooldown: 1,
		djOnly: true
	}
    
	public async run(client: BaseClient, msg: Message<true>): Promise<void> {
		let query = msg.content.split(' ').slice(1)
		const params = query.filter(one => one.startsWith('--'))
		query = query.filter(one => !one.startsWith('--'))

		if (query.length == 0) return errorMessage(msg, 'Երգի լինքը կամ անունը նշված չէ')

		const player = useMainPlayer()
		const channel = msg.member?.voice.channel
        
		if (!channel || !player) return errorMessage(msg, 'Առանց ձայնային ալիք միանալու երգել չեմ կարող')

		if (!params.includes('--no-var') && !params.includes('--nv')) {
			const guildModel = await GuildModel.cache(client, msg.guildId)
			const alias = guildModel.aliases.find((alias) => alias.name === query.join(' '))

			if (alias) {
				query = alias.value.split(' ')
			}
		}

		if (params.includes('--f') || params.includes('--force')) {
			const queue = useQueue(msg.guildId)
			if (queue) {
				const track = await player.search(query.join(' '), {
					requestedBy: msg.member,
				})
				
				if (track) {
					try  {
						queue.addTrack(track.tracks[0])
						queue.swapTracks(0, track.tracks[0])
						queue.node.skip()
					}

					catch (error) {
						errorMessage(msg, 'Ձենս կտրվեց, փորձեք կրկին')
					}
				}
			}

			return
		}

		try {
			player.play(channel!, query.join(' '), {
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
					maxHistorySize: 300
				},
			})
		}
			
		catch (error) {
			errorMessage(msg, 'Ձենս կտրվեց, փորձեք կրկին')
			console.error(error)
		}
	}

	public static async playAction(client: BaseClient, queue: GuildQueue, track: Track) {
		const msg: Message<true> = queue.metadata as Message<true>
		const guildModel = await GuildModel.cache(client, msg.guildId)

		if (guildModel.loop) return

		playerMessage(msg, track, 'Հիմա խաղում է')
	}
}