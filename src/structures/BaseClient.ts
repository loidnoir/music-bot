import ClientOptions from '@constants/ClientOptions'
import ClientSecrets from '@constants/ClientSecrets'
import { PrismaClient } from '@prisma/client'
import { Client, Collection } from 'discord.js'
import glob from 'glob'
import { promisify } from 'util'
import BaseEvent from './BaseEvent'
import BaseCommand from './BaseCommand'
import { Player } from 'discord-player'
import GuildModel from './GuildModel'
import Play from '../commands/Play'
import Queue from '../commands/Queue'
import Skip from '../commands/Skip'

export default class BaseClient extends Client {
	public player: Player
	public guildModel = new Collection<string, GuildModel>()
	public commands = new Collection<string, BaseCommand>()
	public cooldown = new Collection<string, Date>()
	public events = new Collection<string, BaseEvent>()
	public prisma = new PrismaClient()

	constructor() {
		super(ClientOptions)
		this.player = new Player(this)
	}

	public async start() {
		await this.prisma.$connect()
		await this.loadEvents(`${__dirname}/../events/**/**/*{.js,.ts}`)
		await this.loadPlayer()
		await this.login(ClientSecrets.token)

		this.handleErrors()
	}

	private async loadPlayer() {
		this.player.extractors.loadDefault()
		// this.player.extractors.register(DeezerExtractor, {})

		this.player.events.on('playerStart', async (queue, track) => await Play.playAction(queue, track))
		this.player.events.on('audioTrackAdd', async (queue, track) => await Queue.addAction(queue, track))
		this.player.events.on('playerSkip', async (queue, track) => await Skip.skipAction(queue, track))
	}

	private async loadEvents(path: string) {
		const globPromisify = promisify(glob)
		const eventFiles = await globPromisify(path)

		eventFiles.forEach(async (eventFile: string) => {
			try {
				const file = await import(eventFile)
				const event = new (file).default(this) as BaseEvent

				if (!event.run) return

				this.events.set(event.data.name, event)

				if (event.data.once) {
					this.once(event.data.name, (...args) => event.run(this, ...args))
				} else {
					this.on(event.data.name, (...args) => event.run(this, ...args))
				}
			} catch (err) {
				return
			}
		})

	}

	private handleErrors() {
		process.on('uncaughtException', (error) => {
			console.log('Uncaught exception\n', error)
		})

		process.on('unhandledRejection', (error: Error) => {
			console.log('Unhandled rejection\n', error)
		})
	}
}