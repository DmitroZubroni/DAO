import GetPropsal from "../getPropsal/getPropsal.jsx";
import GetVotes from "../getVotes/getVotes.jsx";

const FullCard  = ({proposalID}) => {

    return (
        <div className="container">
            <GetPropsal proposalID={proposalID}/>
            <GetVotes proposalID={proposalID}/>
        </div>

    )
}
export default FullCard ;