import { useEffect, useState } from "react";
import Member from "./member.component";
import APIService from "../../services/api.service";
import { Members } from "../../models/thalia.user.model";

export default function MemberList() {
    const [membersLists, setMembersList] = useState<Members[]>([]);
    const [isFetching, setIsFetching] = useState<boolean>(false);
    const [next, setNext] = useState<string | null>();

    async function getMemberList() {
        let newMembers: Members;

        if(next) {
            //replace base url since the next property still has the concrexit uri attached.
            newMembers = await APIService.get<Members>(next.replace(import.meta.env.VITE_CONCREXIT_URI, ''))
        } else if(!next && membersLists.length == 0) {
            newMembers = await APIService.get<Members>('/api/v2/members?limit=20')
        } else {
            return;
        }

        setMembersList(prevState => [...prevState, newMembers])
        setNext(newMembers.next);
        setIsFetching(false);
    }

    function handleScroll() {
        const bottom = window.innerHeight + window.scrollY == document.documentElement.scrollHeight
        if (bottom && !isFetching) {
            setIsFetching(true);
        }
    }

    useEffect(() => {
        getMemberList();
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll);
    }, [])

    useEffect(() => {
        if(!isFetching) return;
        getMemberList()
    }, [isFetching])

    return (
        <>
            {
                membersLists.length > 0 && (
                    <div className="membersList">
                        { membersLists.map((members, index) => (
                            <div key={index}>
                                { (members && members.results) ? members.results.map(member => <Member {...member} key={member.pk} />) : <></> }
                            </div>
                        ))}
                        
                    </div>
                )
            }
            
        </>
    )
}