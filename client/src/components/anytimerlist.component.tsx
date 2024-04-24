import { useEffect, useState } from "react"
import AnyTimerComponent from "./anytimer.component"
import AnyTimer from '../models/anytimer.model'
import APIService from "../services/api.service"
import APIBase from "../enums/apibase.enum"
import "./anytimerlist.component.css"
import loadingImg from "../images/loading.png"

interface ListProps {
	list_type: 'confirmed' | 'request'
	direction: 'incoming' | 'outgoing'
}

export default function AnyTimerList({ list_type, direction }: ListProps) {
	const [anytimerList, setAnytimerList] = useState<AnyTimer[]>()

	useEffect(() => {
		async function fetchAnytimers() {
			if (list_type == 'request') {
				const list: AnyTimer[] = await APIService.get(APIBase.BACKEND, `/api/anytimers/requests/${direction}`)
				setAnytimerList(list.reverse());
			} else if (list_type == 'confirmed') {
				const list: AnyTimer[] = await APIService.get(APIBase.BACKEND, `/api/anytimers/confirmed/${direction}`)
				setAnytimerList(list.reverse());
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
						anytimerList.map(anytimer => <AnyTimerComponent AnyTimer={anytimer} direction={direction} type={list_type} key={anytimer.id} />)
					: 
						<div className="no-anys-found">
							No anytimers found!
						</div>
				) 
				: 
				(
					<div className="loading">
						<img src={loadingImg} alt="loading" className="loading-image"/>
					</div>
				)
			}
		</div>
	)
}