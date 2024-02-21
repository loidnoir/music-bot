import { Guild } from 'discord.js'

export default function useChannel(guild: Guild, userId: string) {
	return guild.members.cache.get(userId)?.voice.channel ?? undefined
}