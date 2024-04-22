import { ThaliaUser } from '../../models/thalia.user.model'
import Popup from '../popup.component'
import './member.component.css'
import './confirmation.popup.css'
import '../../index.css'
import { ChangeEvent, FormEvent, useState } from 'react';
import APIService from '../../services/api.service'
import APIBase from '../../enums/apibase.enum'
import { useNavigate } from 'react-router-dom';

export default function Member(thalia_user: ThaliaUser) {
    const [showOtherTypeInputBox, setShowOtherTypeInputBox] = useState(false);
    const navigate = useNavigate();

    function toggleOtherInputBox(event: ChangeEvent<HTMLSelectElement>) {
        if(event.target.value == 'other' || showOtherTypeInputBox) setShowOtherTypeInputBox(!showOtherTypeInputBox);
    }

    function giveOrRequestAnyForm() {
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
                        Confirm
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

        APIService.post(APIBase.BACKEND, `/api/users/${thalia_user.pk}/give/`, data);

        navigate('/');
    }

    function postRequestAny(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        
        const formData = new FormData(event.currentTarget);

        const data = {
            'type': showOtherTypeInputBox ? formData.get('othertype') : formData.get('type'),
            'description': formData.get('description'),
            'amount': formData.get('amount'),
        }

        APIService.post(APIBase.BACKEND, `/api/users/${thalia_user.pk}/request/`, data)

        navigate('/requests');
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
                    <form onSubmit={postGiveAny}>
                        {giveOrRequestAnyForm()}
                    </form>
                </Popup>

                <Popup title={"Request anytimer from " + thalia_user.profile.display_name} button={
                    <button className="request-any">
                        REQUEST ANY
                    </button>
                }>
                    <form onSubmit={postRequestAny}>
                        {giveOrRequestAnyForm()}
                    </form>
                </Popup>
            </div>
        </div>
    )
}