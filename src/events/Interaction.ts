import Queue from '@commands/queue/Queue'
import BaseClient from '@structures/BaseClient'
import BaseEvent, { EventData } from '@structures/BaseEvent'
import { Interaction as InteractionType } from 'discord.js'

export default class Interaction extends BaseEvent {
	public data: EventData = {
		name: 'interactionCreate',
		once: false
	}

	public run(client: BaseClient, int: InteractionType<'cached'>): void {
		if (int.isButton()) {
			if (int.customId.startsWith('queue')) {
				const parts = int.customId.split('-')
				const type = parts[1]
				const maxPage = parseInt(parts[3])
				let page = parseInt(parts[2])

				if (type == 'prev') {
					if (page == 1) page = maxPage
					else page -= 1
				}

				else {
					if (page == maxPage) page = 1
					else page += 1
				}

				Queue.getPage(int.message, page, true)
				int.deferUpdate()
			}
		}
	}
}