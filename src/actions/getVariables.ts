import Client from '@structures/Client'
import Variable from '@structures/Variable'
import { Message } from 'discord.js'

export default async function (client: Client, msg: Message<true>): Promise<Variable[]> {
	let variables = client.variables.get(msg.guildId)

	if (!variables) {
		let guildQuery = await client.db.guild.findFirst({
			where: {
				id: msg.guildId
			}
		})

		if (guildQuery) {
			if (guildQuery.aliases == '') {
				variables = []
			}

			else {
				variables = guildQuery.aliases
					.split(';')
					.map(variable => {
						const [name, value] = variable.split('^')
						return new Variable(name, value)
					})
			}
		}

		else {
			guildQuery = await client.db.guild.create({
				data: {
					id: msg.guildId
				}
			})

			variables = []
		}
	}
    
	client.variables.set(msg.guildId, variables)

	return variables
}