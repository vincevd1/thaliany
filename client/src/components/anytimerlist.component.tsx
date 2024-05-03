import { useEffect, useState } from "react"
import AnyTimerComponent from "./anytimer.component"
import AnyTimer from '../models/anytimer.model'
import { APIService, APIBase } from "../services/api.service"
import "./anytimerlist.component.css"
import Loading from "./loading.component"
import { useNotification } from "./notification.component"

type ListProps = {
	list_type: 'confirmed' | 'request'
	direction: 'incoming' | 'outgoing'
	state: 'used' | 'unused' | 'completed'
}

export default function AnyTimerList({ list_type, direction, state}: ListProps) {
	const [anytimerList, setAnytimerList] = useState<AnyTimer[]>()
	const notifications = useNotification()

	useEffect(() => {
		function fetchAnytimers() {
			if (list_type == 'request') {
				APIService.get<AnyTimer[]>(APIBase.BACKEND, `/api/anytimers/requests/${direction}`)
					.then(list => {
						setAnytimerList(list.reverse());
					})
					.catch(() => {
						notifications.notify("Something went wrong while trying to fetch anytimers!");	
					})
			} else if (list_type == 'confirmed') {
				APIService.get<AnyTimer[]>(APIBase.BACKEND, `/api/anytimers/confirmed/${direction}`)
					.then(list => {
						const filteredList = list.filter((anytimer) => {
							return anytimer.status == state
						})
		
						setAnytimerList(filteredList.reverse());
					})
					.catch(() => {
						notifications.notify("Something went wrong while trying to fetch anytimers!");	
					})
			}
		}

		fetchAnytimers();
	}, [])

	function removeAnytimer(id: number) {
		setAnytimerList((previous) => previous?.filter(anytimer => anytimer.id != id));
	}

	return (
		<div className="anytimerList">
			{
				anytimerList ? 
				(
					anytimerList.length > 0 ?
						anytimerList.map(anytimer => <AnyTimerComponent AnyTimer={anytimer} direction={direction} type={list_type} state={state} remove={removeAnytimer} key={anytimer.id} />)
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