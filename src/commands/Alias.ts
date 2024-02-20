import errorMessage from '@helpers/errorMessage'
import BaseClient from '@structures/BaseClient'
import BaseCommand, { CommandData, CommandSettings } from '@structures/BaseCommand'
import GuildModel from '@structures/GuildModel'
import { Message } from 'discord.js'

export default class Alias extends BaseCommand {
	public data: CommandData = {
		name: 'alias',
		aliases: ['var', 'let', 'const'],
		args: ['name', 'value'],
		params: ['--delete', '--create', '--edit', '--d', '--c', '--e']
	}

	public settings: CommandSettings = {
		cooldown: 3,
		djOnly: false
	}

	public async run(client: BaseClient, msg: Message<true>): Promise<void> {
		const guildModel = await GuildModel.cache(client, msg.guildId)
		const params = msg.content.split(' ').slice(1).filter((param) => param.startsWith('--'))
		const args = msg.content.split(' ').slice(1).filter((param) => !param.startsWith('--'))

		if (params.includes('--delete') || params.includes('--d')) {
			const name = args[0]

			guildModel.aliases = guildModel.aliases.filter((alias) => alias.name !== name)
			await GuildModel.save(client, msg.guildId)
		}

		else if (params.includes('--create') || params.includes('--c')) {
			const name = args[0]
			const value = args.slice(1).join(' ')

			if (guildModel.aliases.some((alias) => alias.name === name)) return errorMessage(msg, 'Փոփոխականը արդեն գոյություն ունի')
			if (guildModel.aliases.length > 50) return errorMessage(msg, 'Ամենաշատը կարող եք ստեղծել 50 փոփոխական')
			if (name.includes('^') || name.includes(';')) return errorMessage(msg, 'Փոփոխականների անունը չի կարող պարունակել `^` և `;` նշանը')
			if (value.includes('^') || value.includes(';')) return errorMessage(msg, 'Փոփոխականների արժեքը չի կարող պարունակել `^` և `;` նշանը')
			if (value.length > 200) return errorMessage(msg, 'Փոփոխականների երկարությունը չի կարող գերազանցել 200 նիշը')

			guildModel.aliases.push({ name, value })
			await GuildModel.save(client, msg.guildId)
		}

		else if (params.includes('--edit') || params.includes('--e')) {
			const name = args[0]
			const value = args.slice(1).join(' ')

			if (value.includes('^') || value.includes(';')) return errorMessage(msg, 'Փոփոխականների արժեքը չի կարող պարունակել `^` և `;` նշանը')
			if (value.length > 200) return errorMessage(msg, 'Փոփոխականների երկարությունը չի կարող գերազանցել 200 նիշը')

			const alias = guildModel.aliases.find((alias) => alias.name === name)

			if (!alias) return errorMessage(msg, 'Փոփոխականը չի գտնվել')

			alias.value = value
			await GuildModel.save(client, msg.guildId)
		}

		else {
			const name = args[0]
			const alias = guildModel.aliases.find((alias) => alias.name === name)

			if (!alias) return errorMessage(msg, 'Փոփոխականը չի գտնվել')

			await msg.channel.send(`**${alias.name}** փոփոխականը պարունակությունն է \`${alias.value}\``)
		}
	}
}