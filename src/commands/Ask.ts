import { ClientColors } from '@constants/ClientPreferences'
import ClientSecrets from '@constants/ClientSecrets'
import { GoogleGenerativeAI } from '@google/generative-ai'
import errorMessage from '@helpers/errorMessage'
import BaseClient from '@structures/BaseClient'
import BaseCommand, { CommandData, CommandSettings } from '@structures/BaseCommand'
import { EmbedBuilder, Message } from 'discord.js'

export default class Ask extends BaseCommand {
	public data: CommandData = {
		name: 'ask',
		aliases: [],
		args: ['question']
	}

	public settings: CommandSettings = {
		cooldown: 10,
		djOnly: false,
		modOnly: false
	}

	public async run(client: BaseClient, msg: Message<true>): Promise<void> {
		const genAi = new GoogleGenerativeAI(ClientSecrets.geminiKey!)
		const prompt = msg.content.split(' ').slice(1)
        
		if (!prompt) return errorMessage(msg, 'Հարցը դատարկ է')
        
		await msg.channel.sendTyping()

		const model = genAi.getGenerativeModel({ model: 'gemini-pro' })
		const result = await model.generateContent(prompt)
		const response = await result.response
		const text = response.text().substring(0, 4000)

		const embed = new EmbedBuilder()
			.setColor(ClientColors.action)
			.setDescription(text)

		msg.channel.send({ embeds: [embed] })
	}
}