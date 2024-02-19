import BaseClient from '@structures/BaseClient'
import BaseCommand from '@structures/BaseCommand'
import BaseEvent from '@structures/BaseEvent'
import { ClientEvents } from 'discord.js'
import glob from 'glob'
import { promisify } from 'util'

export default class Ready extends BaseEvent {
	public data = {
		name: 'ready' as keyof ClientEvents,
		once: true
	}

	public async run(client: BaseClient) {	
		await this.loadCommands(client, `${__dirname}/../commands/**/**/*{.js,.ts}`)
	
		console.info('Bot is ready')
	}
	
	private async loadCommands(client: BaseClient, path: string) {
		const globPromise = promisify(glob)
		const commandsFiles = await globPromise(path)

		commandsFiles.forEach(async (commandFile: string) => {
			try {
				const file = await import(commandFile)
				const command = new file.default(client) as BaseCommand

				if (!command.run) return

				client.commands.set(command.data.name, command)
			} catch (error) {
				console.log(error)
			}
		})
	}
}