import { useEffect, useState } from "react"
import APIService from "../services/api.service";
import { ThaliaUser } from "../models/thalia.user.model";
import './anytimer.component.css'
import { AnyTimer } from "../models/anytimer.model";

interface Props {
    AnyTimer: AnyTimer,
    direction: 'outgoing' | 'incoming'
}

//todo change type to anytimer model
export default function AnyTimerComponent({ AnyTimer, direction }: Props) {
    const [displayName, setDisplayName] = useState('');

    useEffect(() => {
        async function getThaliaInfo() {
            if (direction == 'outgoing') {
                const thaliaUser: ThaliaUser = await APIService.get<ThaliaUser>(`/api/v2/members/${AnyTimer.recipient_id}`)
                setDisplayName(thaliaUser.profile.display_name);
            } else if (direction == 'incoming') {
                const thaliaUser: ThaliaUser = await APIService.get<ThaliaUser>(`/api/v2/members/${AnyTimer.owner_id}`)
                setDisplayName(thaliaUser.profile.display_name);
            }
        }

        getThaliaInfo()
    }, [])

    return (
        <div className="anytimer">
            <div className="anytimer-info">
                <span>{displayName}</span>
                <span>Amount: {AnyTimer.amount}</span>
                <span>Type: {AnyTimer.type}</span>
                <span>Description: {AnyTimer.description}</span>
            </div>
            { direction == 'outgoing' ? (
                <button className="use-anytimer">
                    USE
                </button>
                ) : null
            }
        </div>
    )
}