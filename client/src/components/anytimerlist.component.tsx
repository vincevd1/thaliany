import { useEffect, useState } from "react"
import AnyTimerComponent from "./anytimer.component"
import AnyTimer from '../models/anytimer.model'
import APIService from "../services/api.service"

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

interface ListProps {
	list_type: 'confirmed' | 'request'
	direction: 'incoming' | 'outgoing'
}

export default function AnyTimerList({ list_type, direction }: ListProps) {
	const [anytimerList, setAnytimerList] = useState<AnyTimer[]>()

	useEffect(() => {
		async function fetchAnytimers() {
			if (list_type == 'request') {
				const list: AnyTimer[] = await APIService.get('backend', `/api/anytimers/requests/${direction}`)
				setAnytimerList(list);
			} else if (list_type == 'confirmed') {
				const list: AnyTimer[] = await APIService.get('backend', `/api/anytimers/confirmed/${direction}`)
				setAnytimerList(list);
			}
		}

		fetchAnytimers();
	}, [])

	return (
		<div className="anytimerList">
			{
				anytimerList ? (
					anytimerList.map(anytimer => <AnyTimerComponent AnyTimer={anytimer} direction={direction} type={list_type} key={anytimer.id} />)
				) : null
			}
		</div>
	)
}