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
				name: 'Avatar the last airbender',
				type: ActivityType.Watching
			}
		]
	}
}

export default ClientOptions