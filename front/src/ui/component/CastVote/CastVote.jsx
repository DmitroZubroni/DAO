import {Button, Form, FormCheck, FormControl, FormGroup, FormLabel} from "react-bootstrap";
import ServiceVoting from "../../../service/ServiceVoting.jsx";
import {useContext} from "react";
import {AppContext} from "../../../core/context/Context.jsx";

const CastVote = () => {

    const {wallet } = useContext(AppContext);

    const handleSubmit = async e => {
        e.preventDefault();
        const proposalID = Number(e.target[0].value);
        const support = e.target[1].checked;
        const amount = e.target[2].value * 10 ** 12;
        await ServiceVoting.castVote(proposalID, support, amount, wallet);
    }

    return (
        <Form className='container' onSubmit={handleSubmit}>
            <h2> Проголосовать за предложение </h2>
            <FormGroup>
                <FormLabel column={1}>
                    ID предложения
                </FormLabel>

                <FormControl type="number" placeholder="12" min={1}/>
            </FormGroup>

            <FormGroup>
                <FormLabel column={1}>
                    за или против
                </FormLabel>
                <FormCheck/>
            </FormGroup>

            <FormGroup>
                <FormLabel column={1}>
                    количество токенов которыми вы отдайте на голосование
                </FormLabel>

                <FormControl type="number" placeholder="12" min={1}/>
            </FormGroup>

            <Button type="submit" color="primary"> прогосоовать </Button>
        </Form>
    )
}
export default CastVote;