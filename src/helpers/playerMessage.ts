import { ClientColors } from '@constants/ClientPreferences'
import { GuildQueue, Track, useQueue } from 'discord-player'
import { EmbedBuilder, Message, bold } from 'discord.js'

type actionTypes = 'Հիմա խաղում է' | 'Ավելացվեծ ցանկ' | 'Երգը անցանք...'

function constructEmbed(track: Track, action: actionTypes, duration?: boolean) {
	const embed = new EmbedBuilder()
		.setAuthor({ name: action, iconURL: track.thumbnail })
		.setDescription(`${duration ? `\`${track.duration}\` ` : ''}[${bold(track.title)}](${track.url}), արտիստ ${bold(track.author)}`)
		.setFooter({ text: `Պատվիրատու, ${track.requestedBy?.displayName}` })
		.setColor(ClientColors.primary)

	return embed
}

export default async function playerMessage(msg: Message<true>, track: Track, action: actionTypes) {    
	await msg.channel.send({ embeds: [constructEmbed(track, action)] })
}

export async function queueMessage(msg: Message<true>, track: Track, queue: GuildQueue, tracks: Track[]) {
	const queueTracks = tracks
		.map((track: Track, index: number) => { return `\`${index + 1}\` [${bold(track.title)}](${track.url}), արտիստ ${bold(track.author)}` })
		.join('\n')
	
	const embed = constructEmbed(track, 'Հիմա խաղում է')
	
	embed
		.setDescription(`${embed.data.description}\n\n${queueTracks}`)
		.setFooter({ text: `Ցանկի քանակ, ${queue?.tracks.size}` })
		.setColor(ClientColors.secondary)

	await msg.channel.send({ embeds: [embed] })
}

export async function skipMessage(msg: Message<true>) {
	const track = useQueue(msg.guildId)?.tracks.toArray()[0]

	if (!track) return

	const embed = constructEmbed(track, 'Երգը անցանք...')
		
	embed
		.setColor(ClientColors.action)
		.setDescription(`հաջորդը ${embed.data.description}`)
		.setFooter({ text: `Բաց թողող, ${track.requestedBy?.displayName}` })

	if (embed.data.author?.icon_url) {
		embed.data.author.icon_url = undefined
	}

	await msg.channel.send({ embeds: [embed] })
}