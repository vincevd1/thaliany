import { ThaliaUser } from '../../models/thalia.user.model'
import Popup from '../popup.component'
import './member.component.css'

export default function Member(thalia_user: ThaliaUser) {
    return (
        <div className="member">
            <div className="member-info">
                <img src={thalia_user.profile.photo.small} className='member-photo' />
                <span>{thalia_user.profile.display_name}</span>
            </div>

            <Popup button={
                <button className="request-any">
                    REQUEST ANY
                </button>
            }>
                <span>test</span>
            </Popup>
        </div>
    )
}