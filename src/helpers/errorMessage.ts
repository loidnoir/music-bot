import { Message } from 'discord.js'

export default function errorMessage(msg: Message, content: string) {
	msg.channel.send(`${content}. ${msg.author}`)
		.then(msg => {
			setTimeout(() => {
				msg.delete()
			}, 10 * 1000)
		})
}