import { useEffect, useState } from "react"
import AnyTimerComponent from "./anytimer.component"
import AnyTimer from '../models/anytimer.model'
import APIService from "../services/api.service"
import APIBase from "../enums/apibase.enum"
import "./anytimerlist.component.css"
import Loading from "./loading.component"

interface ListProps {
	list_type: 'confirmed' | 'request'
	direction: 'incoming' | 'outgoing'
	state: 'used' | 'unused' | 'completed'
}

export default function AnyTimerList({ list_type, direction, state}: ListProps) {
	const [anytimerList, setAnytimerList] = useState<AnyTimer[]>()

	useEffect(() => {
		async function fetchAnytimers() {
			if (list_type == 'request') {
				const list: AnyTimer[] = await APIService.get(APIBase.BACKEND, `/api/anytimers/requests/${direction}`)
				
				setAnytimerList(list.reverse());
			} else if (list_type == 'confirmed') {
				const list: AnyTimer[] = await APIService.get(APIBase.BACKEND, `/api/anytimers/confirmed/${direction}`)
				const filteredList = list.filter((anytimer) => {
					return anytimer.status == state
				})

				setAnytimerList(filteredList.reverse());
			}
		}

		fetchAnytimers();
	}, [])

	return (
		<div className="anytimerList">
			{
				anytimerList ? 
				(
					anytimerList.length > 0 ?
						anytimerList.map(anytimer => <AnyTimerComponent AnyTimer={anytimer} direction={direction} type={list_type} state={state} key={anytimer.id} />)
					: 
						<div className="no-anys-found">
							No anytimers found!
						</div>
				) 
				: <Loading />
			}
		</div>
	)
}