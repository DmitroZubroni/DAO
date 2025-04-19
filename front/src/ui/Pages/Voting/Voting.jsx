import Header from "../../component/Header/Header.jsx";
import CastVote from "../../component/CastVote/CastVote.jsx";
import CallExecute from "../../component/CallExecute/CallExecute.jsx";
import CancelPropsal from "../../component/CancelProposal/CancelPropsal.jsx";
import DelegateRTK from "../../component/DelegateRTK/DelegateRTK.jsx";

const Voting = () => {
    return (
        <div>
            <Header />
            <CastVote/>
            <CallExecute/>
            <CancelPropsal/>
            <DelegateRTK/>
        </div>
    )
}
export default Voting;