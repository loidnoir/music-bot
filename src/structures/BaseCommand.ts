import { Message } from 'discord.js'
import BaseClient from './BaseClient'

export default abstract class BaseCommand {
	public abstract data: CommandData
	public abstract settings: CommandSettings

	public abstract run(client: BaseClient, msg: Message<true>): void
}

export interface CommandData {
	name: string,
	aliases: string[],
}

export interface CommandSettings {
    cooldown: number,
	djOnly?: boolean
	modOnly?: boolean
}