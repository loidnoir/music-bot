import { ClientOptions } from 'discord.js'

export default {
	intents: [
		'Guilds',
		'GuildMembers',
		'GuildMessageReactions',
		'GuildMessages',
		'GuildEmojisAndStickers',
		'GuildWebhooks',
		'MessageContent',
		'GuildVoiceStates'
	]
} as ClientOptions