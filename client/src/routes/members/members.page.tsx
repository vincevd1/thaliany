import { useEffect, useState } from "react";
import MemberList from "../../components/members/memberlist.component";
import './members.page.css'
import Loading from "../../components/loading.component";
import { useNavigate } from "react-router-dom";
import User from "../../modules/user.module";

export default function Members() {
    const navigate = useNavigate();

    useEffect(() => {
        if(!User.getIsLoggedIn) {
            navigate("/")
        }
    }, [])

    const [search, setSearch] = useState<string>('')
    const [searching, setSearching] = useState<boolean>(false)

    function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
        const val = e.target.value;
        
        //check if the value is still the same after waiting for a second, that means the user
        //stopped typing and we can do a get request to the server.
        setSearching(true)
        setTimeout(() => {
            if(val == e.target.value) {
                setSearch(e.target.value)
                setSearching(false);
            }
        }, 1000)
    }

    if(User.getIsLoggedIn) {
        return(
            <div className="member-page-wrapper">
                <div className="header-wrapper">
                    <h1 className="members-header">MEMBERS</h1>
                    <div className="search-bar">
                        <h2>SEARCH:</h2>
                        <input type="search" name="Search" className="search-box" onChange={ e => handleSearch(e) } />
                    </div>
    
                </div>
    
                {
                    searching ? (
                        <Loading />
                    ):(
                        <MemberList search={search}/>
                    )
                }
            </div>
        )
    }
}