import { ThaliaUser } from '../../models/thalia.user.model'
import Popup from '../popup.component'
import './member.component.css'
import './confirmation.popup.css'

export default function Member(thalia_user: ThaliaUser) {
    return (
        <div className="member">
            <div className="member-info">
                <img src={thalia_user.profile.photo.small} className='member-photo' />
                <span>{thalia_user.profile.display_name}</span>
            </div>

            <Popup title="Are you sure?" button={
                <button className="request-any">
                    GIVE ANY
                </button>
            }>
                <div className="button-wrapper">
                    <button className="confirm-button confirmation-button">
                        Confirm
                    </button>
                    <button className="cancel-button confirmation-button">
                        Cancel
                    </button>
                </div>
            </Popup>
        </div>
    )
}