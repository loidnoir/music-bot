import Client from '@structures/Client'
import Event from '@structures/Event'
import { ClientEvents } from 'discord.js'

export default class extends Event {
	public client: Client
	public name: keyof ClientEvents = 'ready'
	public once: boolean = true

	public constructor(client: Client) {
		super()
		this.client = client
	}

	public execute(): void {
		console.info('[STATUS] Bot ready!')
	}
}
