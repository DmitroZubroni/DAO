import Header from "../../component/Header/Header.jsx";
import { useEffect, useState} from "react";
import ServiceVoting from "../../../service/ServiceVoting.jsx";
import FullCard from "../../component/PropsalCard/Card/FullCard.jsx";

const Propsal = () => {

    const [propsals, setPropsals] = useState([]);

    useEffect(() => {
        (async () => {
            const proposalID = await ServiceVoting.getAllProposalIDs();
            setPropsals(proposalID || []);
            console.log(proposalID);
        }) ()
    }, []);


    return (
        <div>
            <Header />

            {propsals.length > 0 ? (
                propsals.map((proposal, index) => {
                    return (
                        <div key={index}>
                            <FullCard proposalID = {proposal}/>
                            <hr/>
                        </div>
                    );
                })
            ) : (
                <h2 className="btn, container">на данный момент не было создано голосований </h2>
            )}
        </div>
    )
}
export default Propsal;