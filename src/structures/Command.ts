import Client from '@structures/Client'
import { Message as DiscordMessage } from 'discord.js'

export default abstract class {
	public abstract client: Client
	public abstract name: string[]
	public abstract description?: string

	public abstract execute(
		msg: DiscordMessage<true>,
		args: unknown,
		flags: unknown,
	): void
	public abstract loadArgs(args: string[]): unknown
	public abstract loadFlags(flags: string[]): unknown
}
