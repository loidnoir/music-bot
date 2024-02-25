import { ClientColors } from '@constants/ClientPreferences'
import ClientSecrets from '@constants/ClientSecrets'
import { lyricsExtractor } from '@discord-player/extractor'
import errorMessage from '@helpers/errorMessage'
import BaseClient from '@structures/BaseClient'
import BaseCommand, { CommandData, CommandSettings } from '@structures/BaseCommand'
import { EmbedBuilder, Message } from 'discord.js'

export default class Lyrics extends BaseCommand {
	public data: CommandData = {
		name: 'lyrics',
		aliases: ['ly', 'karaoke'],
		args: ['song']
	}

	public settings: CommandSettings = {
		cooldown: 5
	}

	public async run(client: BaseClient, msg: Message<true>): Promise<void> {
		const title = msg.content.split(' ').slice(1)

		if (title.length == 0) return errorMessage(msg, 'Երաժշտւոյթան անվանումը բացակայում է')
		if (!title) return errorMessage(msg, 'Խնդրում եմ նշեք երաժշտության անվանումը')

		const req = await lyricsExtractor(ClientSecrets.geniusKey).search(title.join(' ')).catch(() => null)
        
		if (!req) return errorMessage(msg, 'Այդպիսի անվանումով չկարողացա գտնել')

		const lyrics = req.lyrics.substring(0, 4000)

		const embed = new EmbedBuilder()
			.setColor(ClientColors.action)
			.setAuthor({ name: `Բառերը ${req.title}, արտիստ ${req.artist}`, iconURL: req.thumbnail })
			.setDescription(lyrics)

		try {
			msg.react('🤔')
			msg.channel.send({ embeds: [embed] })
		}

		catch {
			errorMessage(msg, 'Առաջացավ խնդիր')
		}
	}
}