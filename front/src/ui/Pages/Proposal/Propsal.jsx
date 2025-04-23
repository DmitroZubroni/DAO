import Header from "../../component/Header/Header.jsx";
import {useContext, useEffect, useState} from "react";
import ServiceVoting from "../../../service/ServiceVoting.jsx";
import {AppContext} from "../../../core/context/Context.jsx";
import FullCard from "../../component/PropsalCard/Card/FullCard.jsx";

const Propsal = () => {

    const [propsals, setPropsals] = useState([]);
    const {wallet} = useContext(AppContext);

    useEffect(() => {
        (async () => {
            const propsalID = await ServiceVoting.getAllProposalIDs(wallet);
            setPropsals(propsalID || []);
            console.log(propsalID);
        }) ()
    }, [wallet]);


    return (
        <div>
            <Header />

            {propsals.length > 0 ? (
                propsals.map((propsal, index) => {
                    return (
                        <div key={index}>
                            <FullCard propsalID = {propsal}/>
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