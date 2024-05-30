import Client from '@structures/Client'
import { Message } from 'discord.js'

export default async function(client: Client, msg: Message<true>): Promise<string> {
	let prefix = client.prefix.get(msg.guildId)

	if (!prefix) {
		let guildQuery = await client.db.guild.findFirst({
			where: {
				id: msg.guildId
			}
		})

		if (guildQuery) {
			prefix = guildQuery.prefix
		}

		else {
			guildQuery = await client.db.guild.create({
				data: {
					id: msg.guildId
				}
			})

			prefix = guildQuery.prefix
		}
	}
	
	client.prefix.set(msg.guildId, prefix)

	return prefix
}