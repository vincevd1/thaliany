import "./policy.page.css"

export default function PolicyPage() {
    return(
        <div className="privacy-policy">
            <div>
                This website is not maintained by Thalia or Thalia's Technicie, instead it is maintained by Vince van Diermen and Luuk Schukkink.
                If you find a bug please contact us at 'thaliany@thalia.nu' 
            </div>
            <div>
                When using this service you agree to sharing the following data:

                <ul className="data-list">
                    <li>Your name</li>
                    <li>Anytimers</li>
                    <li>Anytimer requests</li>
                    <li>Images and video in the case of completing an anytimer</li>
                </ul>
            </div>

            <div>
                This data will be saved on our server and you agree to that by using the service. This data will not be shared with third parties.
            </div>
            <div>
                We do not own any of the content that users might upload and we are not responsible for any user generated content
            </div>
        </div>
    )
}