import Navigate from "./Navigate";
import MembersList from "./MembersList";


export default function Members() {


    return (
        <>
            <div>
                <Navigate />
            </div>
            <div className="members">
                <div className="members-list">
                    <MembersList />
                </div>
            </div>
        </>
    )
}