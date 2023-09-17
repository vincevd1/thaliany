import AnyTimer from "./anytimer.component"

let outgoingAnytimers = [
	{
		id: 0,
		owner_id: 205,
		recipient_id: 205,
		amount: 1,
		type: 'Beer',
		description: 'Lekker voor je'
	},
	{
		id: 1,
		owner_id: 205,
		recipient_id: 112,
		amount: 2,
		type: 'Beer',
		description: 'Lekker voor je'
	}
]

let incomingAnytimers = [
	{
		id: 0,
		owner_id: 1,
		recipient_id: 205,
		amount: 1,
		type: 'Beer',
		description: `Trek 'n bak`
	},
	{
		id: 1,
		owner_id: 1,
		recipient_id: 112,
		amount: 2,
		type: 'Beer',
		description: 'Lekker voor je'
	}
]

export default function AnyTimerList({ direction }: any) {
	if(direction == 'outgoing') {
		return (
			<>
				{
					outgoingAnytimers.map(anytimer => <AnyTimer AnyTimer={anytimer} direction={direction} key={anytimer.id} />)
				}
			</>
		)
	} else {
		return (
			<>
				{
					incomingAnytimers.map(anytimer => <AnyTimer AnyTimer={anytimer} direction={direction} key={anytimer.id} />)
				}
			</>
		)
	}
}