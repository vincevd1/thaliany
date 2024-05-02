import { useEffect, useState } from "react";
import Member from "./member.component";
import { APIService, APIBase } from "../../services/api.service";
import { Members } from "../../models/thalia.user.model";
import { useNotification } from "../notification.component";

export default function MemberList({ search }: { search: string }) {
    const [membersLists, setMembersList] = useState<Members[]>([]);
    const [isFetching, setIsFetching] = useState<boolean>(false);
    const [next, setNext] = useState<string | null>();
    const notifications = useNotification();

    async function getMemberList() {
        let newMembers: Members = {} as Members;

        try {
            // is there a next link then load it, if not but there are no members loaded yet this is the first load, load them otherwise there are no more members to load.
            if (next) {
                //replace base url since the next property still has the concrexit uri attached.
                newMembers = await APIService.get<Members>(APIBase.CONCREXIT, next.replace(import.meta.env.VITE_CONCREXIT_URI, ''))
            } else if (!next && membersLists.length == 0) {
                if (search && search != '') {
                    newMembers = await APIService.get<Members>(APIBase.CONCREXIT, `/api/v2/members?limit=20&search=${search}`)
                } else {
                    newMembers = await APIService.get<Members>(APIBase.CONCREXIT, '/api/v2/members?limit=20')
                }
            } else {
                // there are no more members to load.
                return;
            }
        } catch (err) {
            notifications.notify("Something went wrong while loading new members!")
        }

        setMembersList(prevState => [...prevState, newMembers])
        setNext(newMembers.next);
        setIsFetching(false);
    }

    function handleScroll() {
        const bottom = (window.innerHeight + window.scrollY) >= document.body.offsetHeight
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
        if (!isFetching) return;
        getMemberList()
    }, [isFetching])

    return (
        <>
            {
                membersLists.length > 0 && (
                    <div className="membersList">
                        {membersLists.map((members, index) => (
                            <div key={index}>
                                {(members && members.results) ? members.results.map(member => <Member {...member} key={member.pk} />) : null}
                            </div>
                        ))}
                    </div>
                )
            }
        </>
    )
}