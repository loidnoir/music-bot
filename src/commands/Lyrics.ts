import getLyrics from '@actions/getLyrics'
import sendError from '@actions/sendError'
import clientColors from '@constants/clientColors'
import Client from '@structures/Client'
import Command from '@structures/Command'
import { useQueue } from 'discord-player'
import { EmbedBuilder, Message } from 'discord.js'

export default class extends Command {
	public description?: string | undefined
	public client: Client
	public name: string[] = ['lyrics', 'lyric', 'ly']

	constructor(client: Client) {
		super()
		this.client = client
	}

	public async execute(
		msg: Message<true>,
		args: LyricsArgs,
		flags: unknown,
	): Promise<void> {
		const queue = useQueue(msg.guildId)
		const song = args.song || queue?.currentTrack?.title

		if (!song) {
			sendError(msg, 'songError')
		} else {
			await msg.channel
				.send('Մի փոքր սպասեք, մտնում եմ գուգլ')
				.then(async (msg) => {
					let index = 0
					const messages = [
						'Մի փոքր սպասեք, փնտրում եմ երգի անունը',
						'Մի փոքր սպասեք, գտա մի բան',
						'Մի փոքր սպասեք, սպասեք բացումա էջը',
						'Մի փոքր սպասեք, մտավ էջը',
						'Մի փոքր սպասեք, փնտրում եմ բառերը էջում',
						'Մի փոքր սպասեք, գտա բառերը, վազում եմ բերեմ',
						'Մի փոքր սպասեք, վուալա',
						'Մի փոքր սպասեք, հլ չի եկել ? հեսա միքիչել սպասեք',
					]

					const interval = setInterval(() => {
						if (index > 7) return
						msg.edit(messages[index])
						index++
					}, 3800)

					try {
						const lyrics = await getLyrics(song)

						clearInterval(interval)

						if (!lyrics) {
							msg.edit('Չգտնվեց...')
						} else {
							const embed = new EmbedBuilder()
								.setColor(clientColors.information)
								.setDescription(lyrics)
								.setFooter({ text: 'Բառերի աղբյուր http://genius.com' })

							msg.edit({ embeds: [embed], content: '' })
						}
					} catch {
						msg.edit('Չգտնվեց...')
						clearInterval(interval)
					}
				})
		}
	}

	public loadArgs(args: string[]): LyricsArgs {
		return {
			song: args.join(' '),
		}
	}

	public loadFlags(flags: string[]): unknown {
		return {}
	}
}

interface LyricsArgs {
	song: string
}
