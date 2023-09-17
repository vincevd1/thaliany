import User from '../modules/user.module'
import './header.component.css'

export default function Header() {
    return (
        <header className='header'>
            <div className='header-container'>
                <h2><a href="/">THALIANY</a></h2>
                <div className="header-nav">
                    <a href="/requests">Requests</a>
                    <a href="/members">Members</a>
                    <button onClick={User.logout}>LOGOUT</button>
                </div>
            </div>
        </header>
    )
}