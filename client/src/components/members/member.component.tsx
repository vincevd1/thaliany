import { ThaliaUser } from '../../models/thalia.user.model'
import Popup from '../popup.component'
import './member.component.css'
import './confirmation.popup.css'
import '../../index.css'
import { ChangeEvent, FormEvent, useState } from 'react';
import { APIService, APIBase } from '../../services/api.service'
// import { useNavigate } from 'react-router-dom';
import { useNotification } from '../notification.component'

export default function Member(thalia_user: ThaliaUser) {
    const [showOtherTypeInputBox, setShowOtherTypeInputBox] = useState(false);
    // const navigate = useNavigate();
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

        var type = formData.get('type')?.toString();
        
        if(type) type = type.charAt(0).toUpperCase() + type.slice(1);
        
        const data = {
            'type': showOtherTypeInputBox ? formData.get('othertype') : type,
            'description': formData.get('description'),
            'amount': formData.get('amount'),
        }

        APIService.post(
            APIBase.BACKEND, 
            `/api/users/${thalia_user.pk}/give/`, 
            data
        ).then(() => {
            // navigate("/");
            notifications.notify(`Successfully gave anytimer to ${thalia_user.profile.display_name}`)
        }).catch((err: any) => {
            if(err.response?.data.message) {
                notifications.notify(`${ err.response?.data.message }`)
            } else {
                notifications.notify("Something went wrong while trying to give anytimer")
            }
        });
    }

    function postRequestAny(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        
        const formData = new FormData(event.currentTarget);
        var type = formData.get('type')?.toString();
        
        if(type) type = type.charAt(0).toUpperCase() + type.slice(1);

        const data = {
            'type': showOtherTypeInputBox ? formData.get('othertype') : type,
            'description': formData.get('description'),
            'amount': formData.get('amount'),
        }

        APIService.post(
            APIBase.BACKEND, 
            `/api/users/${thalia_user.pk}/request/`, 
            data
        ).then(() => {
            // navigate('/requests');
            notifications.notify(`Successfully requested anytimer from ${thalia_user.profile.display_name}`)
        }).catch((err: any) => {
            if(err.response?.data.message) {
                notifications.notify(`${ err.response?.data.message }`)
            } else {
                notifications.notify("Something went wrong while trying to request anytimer")
            }
        });
    }

    return (
        <div className="member">
            <div className="member-info">
                <img src={thalia_user.profile.photo.small} className='member-photo' />
                <span>{thalia_user.profile.display_name}</span>
            </div>

            <div className="interaction-buttons">
                <Popup title={"GIVE ANYTIMER TO " + thalia_user.profile.display_name.toUpperCase()} button={
                    <button className="interaction-button">
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

                <Popup title={"REQUEST ANYTIMER FROM " + thalia_user.profile.display_name.toUpperCase() } button={
                    <button className="interaction-button">
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