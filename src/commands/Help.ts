import BaseClient from '@structures/BaseClient'
import BaseCommand, { CommandData, CommandSettings } from '@structures/BaseCommand'
import { Message } from 'discord.js'

export default class Help extends BaseCommand {
	public data: CommandData = {
		name: 'help',
		aliases: ['h']

	}

	public settings: CommandSettings = {
		cooldown: 0
	}

	public run(client: BaseClient, msg: Message<true>): void {
		msg.reply('## Ինչ ասեմ ախպեր\n- Եմբեդ համարյա չկա\n- Սարքածա սիրով\n- Արփիներին մուտք չկա\n- Բագ տնողը վատ մարդա, Ալեն')
	}
}