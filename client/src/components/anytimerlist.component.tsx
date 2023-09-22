import { useEffect, useState } from "react"
import AnyTimerComponent from "./anytimer.component"
import AnyTimer from '../models/anytimer.model'

let outgoingAnytimers = [
	{
		id: 0,
		owner_id: 205,
		recipient_id: 205,
		amount: 1,
		type: 'Other',
		description: `Broek uit op je hoofd`
	},
	{
		id: 1,
		owner_id: 205,
		recipient_id: 112,
		amount: 2,
		type: 'Beer',
		description: `Trek 'n bak`
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
		recipient_id: 205,
		amount: 2,
		type: 'Beer',
		description: `Trek 'n bak`
	}
]

interface ListProps {
	list_type: 'confirmed' | 'request'
	direction: 'incoming' | 'outgoing'
}

export default function AnyTimerList({ list_type, direction }: ListProps) {
	const [anytimerList, setAnytimerList] = useState<AnyTimer[]>()

	useEffect(() => {
		if (list_type == 'request') {
			if (direction == 'incoming') {
				setAnytimerList(incomingAnytimers);
			} else if (direction == 'outgoing') {
				setAnytimerList(outgoingAnytimers);
			}
		} else if (list_type == 'confirmed') {
			if (direction == 'incoming') {
				setAnytimerList(incomingAnytimers);
			} else if (direction == 'outgoing') {
				setAnytimerList(outgoingAnytimers);
			}
		}
	})

	return (
		<>
			{
				anytimerList ? (
					anytimerList.map(anytimer => <AnyTimerComponent AnyTimer={anytimer} direction={direction} type={list_type} key={anytimer.id} />)
				): null
			}
		</>
	)
}