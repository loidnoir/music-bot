import { ClientColors } from '@constants/ClientPreferences'
import errorMessage from '@helpers/errorMessage'
import BaseClient from '@structures/BaseClient'
import BaseCommand, { CommandData, CommandSettings } from '@structures/BaseCommand'
import { GuildQueue, Track, useMainPlayer, useQueue } from 'discord-player'
import { EmbedBuilder, Message, bold } from 'discord.js'

export default class Play extends BaseCommand {
	public data: CommandData = {
		name: 'play',
		aliases: ['p', 'ergi']
	}
    
	public settings: CommandSettings = {
		cooldown: 1,
		djOnly: true
	}
    
	public async run(client: BaseClient, msg: Message<true>): Promise<void> {
		let query = msg.content.split(' ').slice(1)
		const params = query.filter(one => one.startsWith('--'))
		query = query.filter(one => !one.startsWith('--'))

		console.log(query)
		console.log(params)

		if (query.length == 0) return errorMessage(msg, 'Երգի լինքը կամ անունը նշված չէ')

		const player = useMainPlayer()
		const channel = msg.member?.voice.channel
        
		if (!channel || !player) return errorMessage(msg, 'Առանց ձայնային ալիք միանալու երգել չեմ կարող')


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
			await player.play(channel!, query.join(' '), {
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
		}
	}

	public static async playAction(queue: GuildQueue, track: Track) {
		const msg = queue.metadata as Message<true>

		const embed = new EmbedBuilder()
			.setAuthor({ name: 'Հիմա խաղում է', iconURL: track.thumbnail })
			.setDescription(`[${bold(track.title)}](${track.url}), արտիստ ${bold(track.author)} \`${track.duration}\``)
			.setFooter({ text: `Պատվերը ${track.requestedBy?.displayName + '-ի' ?? 'անհասկանալի մարդու'} կողմից` })
			.setColor(ClientColors.primary)
			
		await msg.channel.send({ embeds: [embed] })
	}
}