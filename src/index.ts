import clientSecrets from '@constants/clientSecrets'
import Client from '@structures/Client'

const TOKEN = clientSecrets.token
const client = new Client()

client.db.$connect()
client.loadEvents()
client.loadCommands()
client.loadPlayer()
client.login(TOKEN)
