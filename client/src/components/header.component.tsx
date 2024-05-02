import { useState } from 'react';
import User from '../modules/user.module'
import './header.component.css'
import { Squash as Hamburger } from 'hamburger-react'

export default function Header() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <header className='header'>
            <div className='header-container'>
                <h2><a href="/">THALIANY</a></h2>
                <div className="header-nav">
                    <a href="/">Home</a>
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

                <div className="hamburger">
                    <Hamburger toggled={isOpen} toggle={setIsOpen} />
                </div>
            </div>

            {
                isOpen && 
                (
                    <div className="dropdown">
                        <a href="/">Home</a>
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
                )
            }
        </header>
    )
}