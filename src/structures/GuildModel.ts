import BaseClient from './BaseClient'

export default class GuildModel {
	public data: GuildModelData

	constructor(data: GuildModelData) {
		this.data = data
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
			client.guildModel.set(id, newModel)
			return newModel
		}
			
		else {
			const newModel = new GuildModel(data)
			client.guildModel.set(id, newModel)
			return newModel
		}
	}

	public static async save(client: BaseClient, id: string): Promise<void> {
		const model = client.guildModel.get(id)

		if (!model) return

		await client.prisma.guild.upsert({
			where: { id: id },
			create: model.data,
			update: model.data
		})
	}
}

export interface GuildModelData {
    id: string,
    prefix: string,
    djRole: string | null,
	djSystem: boolean
}