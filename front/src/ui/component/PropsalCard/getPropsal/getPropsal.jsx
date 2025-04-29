import { Form,  FormGroup, FormLabel} from "react-bootstrap";
import { useEffect, useState} from "react";
import ServiceVoting from "../../../../service/ServiceVoting.jsx";

const Propsals = ({proposalID}) => {


    const [propsal, setPropsal] = useState({proposeID: 0, proposer: 0, targets: 0, values: 0, voteEnd: 0, proposeType: 0, quorumType: 0, status: 0});

    useEffect(() => {
        (async () => {
            const info = await ServiceVoting.getProposalFull(proposalID);
            setPropsal(info);
            console.log(info);
        }) ()
    }, [proposalID]);

    return (
        <Form>
            <h2> информация о голосование  </h2>

            <FormGroup>
                <FormLabel column={1}>
                    ID голосования {propsal.proposeID?.toString() || 0}
                </FormLabel>
            </FormGroup>

            <FormGroup>
                <FormLabel column={1}>
                    создатель голосования {propsal.proposer.toString()}
                </FormLabel>
            </FormGroup>

            <FormGroup>
                <FormLabel column={1}>
                    указаный адрес  {propsal.targets?.toString() || 0}
                </FormLabel>
            </FormGroup>

            <FormGroup>
                <FormLabel column={1}>
                    количество {(Number(propsal.values) / 10 ** 18)?.toFixed(0) || 0}
                </FormLabel>
            </FormGroup>


            <FormGroup>
                <FormLabel column={1}>
                    время окончание {new Date(Number(propsal.voteEnd) * 1000).toLocaleString()}
                </FormLabel>
            </FormGroup>

            <FormGroup>
                <FormLabel column={1}>
                    тип голосования {propsal.proposeType.toString()}
                </FormLabel>
            </FormGroup>

            <FormGroup>
                <FormLabel column={1}>
                    тип достижения кворума  {propsal.quorumType.toString()}
                </FormLabel>
            </FormGroup>

            <FormGroup>
                <FormLabel column={1}>
                    статус {propsal.status.toString()}
                </FormLabel>
            </FormGroup>


        </Form>
    )
}
export default Propsals;