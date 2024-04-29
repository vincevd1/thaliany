import User from '../modules/user.module'
import './header.component.css'

export default function Header() {
    return (
        <header className='header'>
            <div className='header-container'>
                <h2><a href="/">THALIANY</a></h2>
                <div className="header-nav">
                    <a href="/proofs">Proofs</a>
                    <a href="/requests">Requests</a>
                    <a href="/members">Members</a>

                    {
                        User.getIsLoggedIn ? (
                            <button onClick={User.logout}>LOGOUT</button>
                        ) : (
                            <button onClick={User.login}>LOGIN</button>
                        )
                    }   
                </div>
            </div>
        </header>
    )
}