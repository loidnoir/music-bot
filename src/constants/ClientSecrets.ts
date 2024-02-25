import dotenv from 'dotenv'

dotenv.config({ path: __dirname + '/../.env' })

const ClientSecrets = {
	token: process.env.TOKEN,
	clientId: process.env.CLIENT_ID,
	geniusKey: process.env.GENIUS,
	geminiKey: process.env.GEMINI
}

export default ClientSecrets