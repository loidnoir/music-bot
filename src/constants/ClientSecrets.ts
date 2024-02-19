const ClientSecrets = {
	token: process.env.DEV == 'true' ? process.env.TOKEN : process.env.DEV_TOKEN,
	clientId: process.env.DEV == 'true' ? process.env.CLIENT_ID : process.env.DEV_CLIENT_ID,
}

export default ClientSecrets