import dotenv from 'dotenv'

dotenv.config({ path: __dirname + '/../.env' })

export default {
	token: process.env.TOKEN,
	clientId: process.env.CLIENT_ID,
	databaseUrl: process.env.DATABASE_URL,
	statusGuild: '1090666199446196364',
}
