import { Form,  FormGroup, FormLabel} from "react-bootstrap";
import {useContext, useEffect, useState} from "react";
import {AppContext} from "../../../../core/context/Context.jsx";
import ServiceVoting from "../../../../service/ServiceVoting.jsx";

const Votes = (proposalID) => {

    const {wallet} = useContext(AppContext);

    const [votes, setVotes] = useState({forVotes: 0, againstVotes: 0});

    useEffect(() => {
        (async () => {
            const info = await ServiceVoting.getProposalVotes(proposalID, wallet);
            setVotes(info);
            console.log(info);
        }) ()
    }, [wallet]);

    return (
        <Form className="container">
            <h2> балансы пользователя </h2>
            <FormGroup>
                <FormLabel column={1}>
                    голоса против {votes.againstVotes.toString()}
                </FormLabel>
            </FormGroup>

            <FormGroup>
                <FormLabel column={1}>
                    голоса за {votes.forVotes.toString()}
                </FormLabel>
            </FormGroup>

        </Form>
    )
}
export default Votes;