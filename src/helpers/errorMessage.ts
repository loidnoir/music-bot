import { Message } from 'discord.js'

export default function errorMessage(msg: Message, content: string) {
	msg.channel.send(`${content}. ${msg.author}`)
		.then(bot_msg => {
			setTimeout(() => {
				bot_msg.delete()
				msg.react('❌')
			}, 10 * 1000)
		})
}