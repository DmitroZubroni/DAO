import { Form,  FormGroup, FormLabel} from "react-bootstrap";
import { useEffect, useState} from "react";
import ServiceVoting from "../../../../service/ServiceVoting.jsx";

const Votes = ({proposalID}) => {

    const [targetsInfo,setTargets] = useState({targets: 0, values: 0});

    useEffect(() => {
        (async () => {
            const info = await ServiceVoting.getVoteData(proposalID);
            setTargets(info);
            console.log(info);
        }) ()
    }, [proposalID]);

    return (
        <Form>
            <h2> куда и сколько </h2>
            <FormGroup>
                <FormLabel column={1}>
                    указаный адрес  {targetsInfo.targets.toString()}
                </FormLabel>
            </FormGroup>

            <FormGroup>
                <FormLabel column={1}>
                    количество {(Number(targetsInfo.values) / 10 ** 18).toFixed(0)}
                </FormLabel>
            </FormGroup>

        </Form>
    )
}
export default Votes;