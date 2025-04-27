import {Button, Form, FormControl, FormGroup, FormLabel} from "react-bootstrap";
import ServiceVoting from "../../../service/ServiceVoting.jsx";
import {useContext} from "react";
import {AppContext} from "../../../core/context/Context.jsx";

const CancelPropsal = () => {

    const {wallet } = useContext(AppContext);

    const handleSubmit = async e => {
        e.preventDefault();
        const proposalID = Number(e.target[0].value);
        await ServiceVoting.cancelProposal(proposalID ,wallet);
    };

    return (
        <Form className='container' onSubmit={handleSubmit}>
            <h2> отмена предложения </h2>
            <FormGroup>
                <FormLabel column={1}>
                    ID предложения
                </FormLabel>

                <FormControl type="number" placeholder="1, 2, 3 ..." min={1}/>

            </FormGroup>

            <Button type="submit" color="primary"> отменить </Button>
        </Form>
    )
}
export default CancelPropsal