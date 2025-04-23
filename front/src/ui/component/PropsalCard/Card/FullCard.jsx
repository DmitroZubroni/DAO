import GetPropsal from "../getPropsal/getPropsal.jsx";
import GetVotes from "../getVotes/getVotes.jsx";
import GetVoteTargets from "../getVoteTargets/getVoteTargets.jsx";

const FullCard  = ({proposalID}) => {

    return (
        <div className="container">
            <GetPropsal proposalID={proposalID}/>
            <GetVotes proposalID={proposalID}/>
            <GetVoteTargets proposalID={proposalID}/>
        </div>

    )
}
export default FullCard ;