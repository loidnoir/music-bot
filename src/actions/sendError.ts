import clientErrors from '@constants/clientErrors'
import { Message } from 'discord.js'

export default async function(msg: Message<true>, error: keyof typeof clientErrors, ...content: string[]): Promise<Message<true>> {
	return msg.channel.send({
		content: clientErrors[error] + (content.length ? `\n\n${content.join('\n')}` : '')
	})
}