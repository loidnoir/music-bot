import BaseClient from '@structures/BaseClient'

async function start() {
	const client = new BaseClient()
	console.log(process.env.TOKEN)
	await client.start()
}

start()
