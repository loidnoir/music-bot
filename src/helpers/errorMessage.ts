import { Message } from 'discord.js'

export default function errorMessage(msg: Message, content: string) {
	msg.reply(`### Սխալմունք\n${content}`)
}