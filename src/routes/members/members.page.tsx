import MemberList from "../../components/members/memberlist.component";
import './members.page.css'

export default function Members() {
    return(
        <div className="member-page-wrapper">
            <h1 className="members-header">Members</h1>
            <MemberList />
        </div>
    )
}