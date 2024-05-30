import Queue from '@commands/Queue'
import Client from '@structures/Client'
import Event from '@structures/Event'
import {
	ClientEvents,
	Interaction as DiscordInteraction,
	GuildTextBasedChannel,
	Message,
} from 'discord.js'

export default class extends Event {
	public name: keyof ClientEvents = 'interactionCreate'
	public once: boolean = false
	public client: Client

	constructor(client: Client) {
		super()
		this.client = client
	}

	public execute(ctx: DiscordInteraction): void {
		if (ctx.isButton()) {
			if (ctx.customId.startsWith('queue')) {
				const params = ctx.customId.split('-')

				const action = params[1]
				const maxPage = parseInt(params[3])
				let page = parseInt(params[2])

				if (action == 'prev') {
					if (page == 1) page = maxPage
					else page -= 1
				} else if (action == 'next') {
					if (page == maxPage) page = 1
					else page += 1
				}

				const status = Queue.sendPage(
					ctx.channel as GuildTextBasedChannel,
					page,
					true,
					ctx.message as Message<true>,
				)

				if (!status) return

				ctx.deferUpdate()
			}
		}
	}
}
