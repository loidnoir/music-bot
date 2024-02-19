import { ActivityType, ClientOptions as ClientOptionsType, Partials } from 'discord.js'

const ClientOptions: ClientOptionsType = {
	intents: [
		'DirectMessages',
		'GuildMembers',
		'Guilds',
		'GuildMessageReactions',
		'GuildMessages',
		'GuildPresences',
		'GuildVoiceStates',
		'GuildWebhooks',
		'MessageContent'
	],
	partials: [
		Partials.Channel,
		Partials.GuildMember,
		Partials.Message,
		Partials.User,
		Partials.Reaction
	],
	presence: {
		activities: [
			{
				name: 'League of Legends',
				type: ActivityType.Playing
			}
		]
	}
}

export default ClientOptions