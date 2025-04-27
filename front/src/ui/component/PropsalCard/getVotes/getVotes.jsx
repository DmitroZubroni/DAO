import { Form,  FormGroup, FormLabel} from "react-bootstrap";
import { useEffect, useState} from "react";
import ServiceVoting from "../../../../service/ServiceVoting.jsx";

const Votes = ({proposalID}) => {


    const [votes, setVotes] = useState({forVotes: 0, againstVotes: 0});

    useEffect(() => {
        (async () => {
            const info = await ServiceVoting.getProposalVotes(proposalID);
            setVotes(info);
            console.log(info);
        }) ()
    }, [proposalID]);

    return (
        <Form>
            <h2> количество голосов</h2>
            <FormGroup>
                <FormLabel column={1}>
                    голоса против {votes.againstVotes?.toString() || 0}
                </FormLabel>
            </FormGroup>

            <FormGroup>
                <FormLabel column={1}>
                    голоса за {votes.forVotes?.toString() || 0}
                </FormLabel>
            </FormGroup>

        </Form>
    )
}
export default Votes;