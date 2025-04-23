import GetPropsal from "../getPropsal/getPropsal.jsx";
import GetVotes from "../getVotes/getVotes.jsx";

const FullCard  = (propsalID) => {

    return (
        <div className="container">
            <GetPropsal propsalID={propsalID}/>
            <GetVotes propsalID={propsalID}/>
        </div>

    )
}
export default FullCard ;