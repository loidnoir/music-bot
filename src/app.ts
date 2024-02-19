import BaseClient from '@structures/BaseClient'

async function start() {
	const client = new BaseClient()
	await client.start()
}

start()
