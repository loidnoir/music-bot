import Client from '@structures/Client'
import { ActivityType } from 'discord.js'

export default function (
	client: Client,
	status: 'dnd' | 'online' | 'idle',
	name: string,
	state: string,
	url?: string,
) {
	client.user?.setPresence({
		status: status,
		activities: [
			{
				type: ActivityType.Custom,
				name,
				state,
				url,
			},
		],
	})
}
