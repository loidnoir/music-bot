import setStatus from '@actions/setStatus'
import clientSecrets from '@constants/clientSecrets'
import ClientSettings from '@constants/clientSettings'
import Interaction from '@events/Interaction'
import Message from '@events/Message'
import Ready from '@events/Ready'
import { PrismaClient } from '@prisma/client'
import Command from '@structures/Command'
import { Player } from 'discord-player'
import DeezerExtractor from 'discord-player-deezer'
import {
	Client as BaseClient,
	Collection,
	Message as DiscordMessage,
} from 'discord.js'
import * as fs from 'fs'
import * as path from 'path'
import PlayerMessage from './PlayerMessage'
import Variable from './Variable'

export default class extends BaseClient {
	public db: PrismaClient = new PrismaClient()
	public player: Player = new Player(this)
	public commands: Collection<string[], Command> = new Collection()
	public prefix: Collection<string, string> = new Collection()
	public variables: Collection<string, Variable[]> = new Collection()

	constructor() {
		super(ClientSettings)
	}

	public loadEvents() {
		this.on('ready', () => new Ready(this).execute())
		this.on('messageCreate', (msg) => new Message(this).execute(msg))
		this.on('interactionCreate', (ctx) => new Interaction(this).execute(ctx))
	}

	public async loadCommands() {
		const directoryPath = path.join(__dirname, '../commands')
		const stack = [directoryPath]

		while (stack.length > 0) {
			const currentPath = stack.pop()
			const entries = fs.readdirSync(currentPath!, { withFileTypes: true })

			for (const entry of entries) {
				const fullPath = path.join(currentPath!, entry.name)

				if (entry.isDirectory()) {
					stack.push(fullPath)
				} else if (entry.isFile()) {
					const command: Command = new (await import(fullPath)).default(this)
					console.log(command.name)
					this.commands.set(command.name, command)
				}
			}
		}
	}

	public async loadPlayer() {
		this.player.extractors.register(DeezerExtractor, {})
		this.player.extractors.loadDefault()

		this.player.on('error', (error) => {
			console.info(error)
		})

		this.player.events.on('error', (_, error) => {
			console.info(error)
		})

		this.player.on('voiceStateUpdate', (queue) => {
			const metdata = queue.metadata as DiscordMessage
			if (metdata.guildId == clientSecrets.statusGuild) {
				setStatus(
					this,
					'online',
					'Երգում եմ',
					`Հիմա խաղում եմ ${queue.currentTrack?.title}, հեղինակ ${queue.currentTrack?.author}`,
					queue.currentTrack?.url,
				)
			}
		})

		this.player.events.on('playerError', (queue, error) => {
			const msg = new PlayerMessage('error', [], [])
			const metdata: DiscordMessage<true> = queue.metadata

			console.info(error)

			msg.sendMessage(metdata, { author: this.user?.avatarURL() ?? undefined })
		})

		this.player.events.on('playerStart', (queue, track) => {
			const metdata: DiscordMessage<true> = queue.metadata
			const msg = new PlayerMessage(
				'playing',
				[track.title, track.author],
				[track.requestedBy?.displayName],
			)

			msg.sendMessage(metdata, { author: track.thumbnail })
		})

		this.player.events.on('playerPause', (queue) => {
			const metdata: DiscordMessage<true> = queue.metadata
			const msg = new PlayerMessage(
				'pause',
				[queue.currentTrack?.title],
				[metdata.author.displayName],
			)

			msg.sendMessage(metdata, { author: queue.currentTrack?.thumbnail })
		})

		this.player.events.on('playerResume', (queue) => {
			const metdata: DiscordMessage<true> = queue.metadata
			const msg = new PlayerMessage(
				'resume',
				[queue.currentTrack?.title],
				[metdata.author.displayName],
			)

			msg.sendMessage(metdata, { author: queue.currentTrack?.thumbnail })
		})

		this.player.events.on('audioTrackAdd', (queue, track) => {
			const metdata: DiscordMessage<true> = queue.metadata
			const msg = new PlayerMessage(
				'addTrack',
				[track.title, track.author],
				[track.requestedBy?.displayName],
			)

			msg.sendMessage(metdata, { author: track.thumbnail })
		})

		this.player.events.on('audioTracksAdd', (queue, tracks) => {
			const metdata: DiscordMessage<true> = queue.metadata
			const msg = new PlayerMessage(
				'addTracks',
				[
					tracks.length.toString(),
					tracks
						.slice(0, 5)
						.map((track, i) => {
							return `\`${i + 1}\` **[${track.title}](${track.url})**, կատարող **${track.author}**`
						})
						.join('\n')
						.concat(tracks.length < 5 ? '' : '...'),
				],
				[metdata.author.displayName],
			)

			msg.sendMessage(metdata, { author: tracks[0].thumbnail })
		})

		this.player.events.on('playerSkip', (queue, track) => {
			const metdata: DiscordMessage<true> = queue.metadata
			const msg = new PlayerMessage(
				'skip',
				[track.title, track.author],
				[metdata.author.displayName],
			)

			msg.sendMessage(metdata, { author: track.thumbnail })
		})

		this.player.events.on('disconnect', (queue) => {
			const metdata: DiscordMessage<true> = queue.metadata
			const msg = new PlayerMessage('disconnect', [], [])

			msg.sendMessage(metdata, { author: this.user?.displayAvatarURL() })
		})
	}
}
