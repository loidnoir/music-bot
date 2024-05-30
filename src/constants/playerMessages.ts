import clientColors from '@constants/clientColors'

const playerMessages = {
	error: {
		author: 'Սխալմունք',
		description:
			'Տեղի ունեցավ շատ անսպասելի սխալմունք, խնդրում եմ տեղեկացրեք Սամոին',
		color: clientColors.error,
	} as PlayerMessage,
	pause: {
		author: 'Կանգնեցվեց',
		description: 'Երաժշտությունը կանգնեցվեց **{}**',
		footer: 'Հրամանը {} կողմից',
		color: clientColors.information,
	} as PlayerMessage,
	resume: {
		author: 'Շարունակում եմ',
		description: 'Շարունակում է **{}**',
		color: clientColors.information,
		footer: 'Հրամանը {} կողմից',
	} as PlayerMessage,
	playing: {
		author: 'Հիմա երգում է',
		description: '**{}**, կատարող **{}**',
		footer: 'Հրամանը {} կողմից',
		color: clientColors.nowPlays,
	} as PlayerMessage,
	addTrack: {
		author: 'Հերթը փոփոխվեց',
		description: 'Ավելացվեց **{}**, կատարող **{}**',
		footer: 'Պատվիրատու {}',
		color: clientColors.songUpdate,
	} as PlayerMessage,
	addTracks: {
		author: 'Հերթը շատ փոփոխվեց',
		description: 'Ավեացվեց **{}** երգ,\n{}',
		footer: 'Պատվիրատու {}',
		color: clientColors.songUpdate,
	} as PlayerMessage,
	skip: {
		author: 'Երգը անցանք',
		description: 'Բաց եմ թողնում **{}**',
		footer: 'Հրամանը {} կողմից',
		color: clientColors.songUpdate,
	} as PlayerMessage,
	disconnect: {
		author: 'Վերջ',
		description: 'Գործ լին... երգի ցանկություն լինի գրեք!',
		footer: '47',
		color: clientColors.information,
	} as PlayerMessage,
} as const

interface PlayerMessage {
	author: string
	description: string

	color: (typeof clientColors)[keyof typeof clientColors]
	footer?: string
}

export default playerMessages
