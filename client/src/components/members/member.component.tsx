import { ThaliaUser } from '../../models/thalia.user.model'
import Popup from '../popup.component'
import './member.component.css'
import './confirmation.popup.css'
import '../../index.css'
import { ChangeEvent, FormEvent, useState } from 'react';
import { APIService, APIBase } from '../../services/api.service'
import { useNavigate } from 'react-router-dom';
import { useNotification } from '../notification.component'

export default function Member(thalia_user: ThaliaUser) {
    const [showOtherTypeInputBox, setShowOtherTypeInputBox] = useState(false);
    const navigate = useNavigate();
    const notifications = useNotification();

    function toggleOtherInputBox(event: ChangeEvent<HTMLSelectElement>) {
        if(event.target.value == 'other' || showOtherTypeInputBox) setShowOtherTypeInputBox(!showOtherTypeInputBox);
    }

    function giveOrRequestAnyForm(close: () => void) {
        return(
            <>
                <div className="form-content">
                    <span>Select Type</span>
                    <select name="type" id="type" onChange={toggleOtherInputBox}>
                        <option value="beer">Beer</option>
                        <option value="wine">Wine</option>
                        <option value="other">Other</option>
                    </select>
                    {showOtherTypeInputBox && <input type="text" name="othertype" id="othertype" />}

                    <span>Description</span>
                    <textarea name="description" id="description" cols={30} rows={10}></textarea>

                    <span>Amount</span>
                    <input type="number" name="amount" id="amount" defaultValue="1" min={1} />
                </div>
                <div className="button-wrapper">
                    <button className="confirm-button confirmation-button" type='submit' >
                        CONFIRM
                    </button>
                    <button className='cancel-button confirmation-button' onClick={close}>
                        CANCEL
                    </button>
                </div>
            </>
        )
    }

    function postGiveAny(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        
        const formData = new FormData(event.currentTarget);
        
        const data = {
            'type': showOtherTypeInputBox ? formData.get('othertype') : formData.get('type'),
            'description': formData.get('description'),
            'amount': formData.get('amount'),
        }

        APIService.post(
            APIBase.BACKEND, 
            `/api/users/${thalia_user.pk}/give/`, 
            data
        ).then(() => {
            navigate('/');
            notifications.notify(`Successfully gave anytimer to ${thalia_user.profile.display_name}`)
        }).catch(() => {
            notifications.notify("Something went wrong while trying to give anytimer")
        });
    }

    function postRequestAny(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        
        const formData = new FormData(event.currentTarget);

        const data = {
            'type': showOtherTypeInputBox ? formData.get('othertype') : formData.get('type'),
            'description': formData.get('description'),
            'amount': formData.get('amount'),
        }

        APIService.post(
            APIBase.BACKEND, 
            `/api/users/${thalia_user.pk}/request/`, 
            data
        ).then(() => {
            navigate('/requests');
            notifications.notify(`Successfully requested anytimer from ${thalia_user.profile.display_name}`)
        }).catch(() => {
            notifications.notify("Something went wrong while trying to request anytimer")
        });
    }

    return (
        <div className="member">
            <div className="member-info">
                <img src={thalia_user.profile.photo.small} className='member-photo' />
                <span>{thalia_user.profile.display_name}</span>
            </div>

            <div className="interaction-buttons">
                <Popup title={"Give Anytimer to " + thalia_user.profile.display_name} button={
                    <button className="request-any">
                        GIVE ANY
                    </button>
                }>
                    {
                        close => (
                            <form onSubmit={e => {
                                postGiveAny(e)
                                close()
                            }}>
                                {giveOrRequestAnyForm(close)}
                            </form>
                        )
                    }
                </Popup>

                <Popup title={"Request anytimer from " + thalia_user.profile.display_name} button={
                    <button className="request-any">
                        REQUEST ANY
                    </button>
                }>
                    {
                        close => (
                            <form onSubmit={e => {
                                postRequestAny(e)
                                close()
                            }}>
                                {giveOrRequestAnyForm(close)}
                            </form>
                        )
                    }
                </Popup>
            </div>
        </div>
    )
}