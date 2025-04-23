import { Form,  FormGroup, FormLabel} from "react-bootstrap";
import {useContext, useEffect, useState} from "react";
import {AppContext} from "../../../../core/context/Context.jsx";
import ServiceVoting from "../../../../service/ServiceVoting.jsx";

const Votes = ({proposalID}) => {

    const {wallet} = useContext(AppContext);

    const [targetsInfo,setTargets] = useState({targets: 0, values: 0});

    useEffect(() => {
        (async () => {
            const info = await ServiceVoting.getVoteData(proposalID, wallet);
            setTargets(info);
            console.log(info);
        }) ()
    }, [proposalID, wallet]);

    return (
        <Form>
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