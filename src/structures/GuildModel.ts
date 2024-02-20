import BaseClient from './BaseClient'

export default class GuildModel {
	public data: GuildModelData
	public aliases: Alias[]
	public loop: boolean

	constructor(data: GuildModelData) {
		this.data = data
		this.loop = false
		this.aliases = []
	}

	public static async cache(client: BaseClient, id: string): Promise<GuildModel> {
		const model = client.guildModel.get(id)

		if (model) return model

		const data = await client.prisma.guild.findFirst({
			where: {
				id: id
			}
		})
			
		if (!data) {
			const createdData = await client.prisma.guild.create({
				data: { id: id }
			})
				
			const newModel = new GuildModel(createdData)
			newModel.aliases = []
			client.guildModel.set(id, newModel)
			return newModel
		}
			
		else {
			const newModel = new GuildModel(data)
			newModel.aliases = this.convertAliases(data.aliases)
			client.guildModel.set(id, newModel)
			return newModel
		}
	}

	public static async save(client: BaseClient, id: string): Promise<void> {
		const model = await this.cache(client, id)

		if (!model) return

		console.log(model.aliases)
		const aliases = this.convertAliasesToString(model.aliases)
		model.data.aliases = aliases
		console.log(aliases)

		await client.prisma.guild.upsert({
			where: { id: id },
			create: model.data,
			update: model.data
		})
	}

	public static convertAliases(data: string) {
		const aliases: Alias[] = []

		if (data != '') {
			data.split(';').map((alias: string) => {
				const [name, value] = alias.split('^')
				aliases.push({ name, value })
			})
		}

		return aliases
	}

	public static convertAliasesToString(aliases: Alias[]) {
		let res: string = ''
		
		res += aliases.map((alias) => alias.name + '^' + alias.value).join(';')

		return res
	}
}

export interface GuildModelData {
    id: string,
	aliases: string,
    prefix: string,
    djRole: string | null,
	djSystem: boolean
}

export interface Alias {
	name: string,
	value: string
}
