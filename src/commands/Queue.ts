import getQueuePage from '@actions/getQueuePage'
import sendError from '@actions/sendError'
import clientColors from '@constants/clientColors'
import Client from '@structures/Client'
import Command from '@structures/Command'
import { useQueue } from 'discord-player'
import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	EmbedBuilder,
	GuildTextBasedChannel,
	Message,
	MessageActionRowComponentBuilder,
} from 'discord.js'

export default class Queue extends Command {
	public client: Client
	public name: string[] = ['queue', 'q']

	constructor(client: Client) {
		super()
		this.client = client
	}

	public execute(msg: Message<true>, args: QueueArgs, flags: QueueFlags): void {
		const channel = msg.member?.voice.channel

		if (!channel) {
			sendError(msg, 'noChannel')
			return
		}

		if (flags.goto) {
			const queue = useQueue(msg.guildId)
			const track = queue?.tracks.at(args.song)

			if (!track) {
				sendError(msg, 'undefinedSongIndex')
				return
			}

			queue?.node.move(track, 0)
		} else if (flags.remove) {
			const queue = useQueue(msg.guildId)
			const track = queue?.tracks.at(args.song)

			if (!track) {
				sendError(msg, 'undefinedSongIndex')
				return
			}

			queue?.node.remove(track)
		} else {
			const status = Queue.sendPage(
				msg.channel,
				isNaN(args.page) ? 1 : args.page,
				false,
			)

			if (!status) {
				sendError(msg, 'emptyQueue')
				return
			}
		}
	}

	public static sendPage(
		channel: GuildTextBasedChannel,
		page: number,
		edit: boolean,
		msg?: Message<true>,
	): boolean {
		const [tracks, maxPage] = getQueuePage(channel.guildId, page)
		const currentTrack = useQueue(channel.guildId)?.currentTrack

		if (maxPage == 0) return false
		if (!tracks.length) return false

		const embed = new EmbedBuilder()
			.setColor(clientColors.queue)
			.setAuthor({
				name: `Հիմա խաղում է ${currentTrack?.title}, հեղինակ ${currentTrack?.author}`,
				iconURL: currentTrack?.thumbnail ?? undefined,
				url: currentTrack?.url,
			})
			.setDescription(
				tracks
					.map((track, i) => {
						return `\`${(page - 1) * 10 + i + 1}\` **[${track.title}](${track.url})**, հեղինակ **${track.author}**`
					})
					.join('\n'),
			)

		if (tracks.length == 0) return false

		const buttons = [
			new ButtonBuilder()
				.setCustomId(`queue-prev-${page}-${maxPage}`)
				.setEmoji('<:LeftArrow:1091643707851288616>')
				.setStyle(ButtonStyle.Secondary)
				.setLabel('Հետ'),
			new ButtonBuilder()
				.setCustomId(`queue-next-${page}-${maxPage}`)
				.setEmoji('<:Rightarrow:1090633097994838026>')
				.setStyle(ButtonStyle.Secondary)
				.setLabel('Առաջ'),
			new ButtonBuilder()
				.setCustomId(`queue-update-${page}-${maxPage}`)
				.setEmoji('<:Moderation:1089210126977744998>')
				.setStyle(ButtonStyle.Secondary)
				.setLabel('Թարմացնել'),
		]

		const actionRow =
			new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
				buttons,
			)

		edit
			? msg?.edit({ embeds: [embed], components: [actionRow] })
			: channel.send({ embeds: [embed], components: [actionRow] })

		return true
	}

	public loadArgs(args: string[]): QueueArgs {
		return {
			page: parseInt(args[0]),
			song: parseInt(args[0]) - 1,
		}
	}

	public loadFlags(flags: string[]): QueueFlags {
		return {
			goto: flags.includes('--go') || flags.includes('--g'),
			remove: flags.includes('--rem') || flags.includes('--r'),
		}
	}
}

interface QueueArgs {
	page: number
	song: number
}

interface QueueFlags {
	goto: boolean
	remove: boolean
}
