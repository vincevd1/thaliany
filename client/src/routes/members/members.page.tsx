import { useState } from "react";
import MemberList from "../../components/members/memberlist.component";
import './members.page.css'

export default function Members() {
    const [search, setSearch] = useState<string>('')
    const [searching, setSearching] = useState<boolean>(false)

    function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
        const val = e.target.value;
        
        //check if the value is still the same after waiting for two seconds, that means the user
        //stopped typing and we can do a get request to the server.
        setSearching(true)
        setTimeout(() => {
            if(val == e.target.value) {
                setSearch(e.target.value)
                setSearching(false);
            }
        }, 1000)
    }

    return(
        <div className="member-page-wrapper">
            <div className="header-wrapper">
                <h1 className="members-header">Members</h1>
                <div className="search-bar">
                    <h2>Search:</h2>
                    <input type="search" name="Search" className="search-box" onChange={ e => handleSearch(e) } />
                </div>

            </div>

            {
                searching ? (
                    <div>Loading, please wait</div>
                ):(
                    <MemberList search={search}/>
                )
            }
        </div>
    )
}