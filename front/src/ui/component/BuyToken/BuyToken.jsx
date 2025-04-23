import {Button, Form, FormControl, FormGroup, FormLabel} from "react-bootstrap";
import ServiceVoting from "../../../service/ServiceVoting.jsx";
import {useContext} from "react";
import {AppContext} from "../../../core/context/Context.jsx";

const DelegateRTK = () => {

    const {wallet } = useContext(AppContext);

    const handleSubmit = async e => {
        e.preventDefault();
        const amount = Number(e.target[0].value);
        const valueAmount = amount * 10 ** 18;
        await ServiceVoting.buyToken(amount, valueAmount, wallet);
    };

    return (
        <Form className='container' onSubmit={handleSubmit}>
            <h2>  покупка токенов </h2>
            <FormGroup>
                <FormLabel column={1}>
                    сколько
                </FormLabel>

                <FormControl/>
            </FormGroup>

            <Button type="submit" color="primary"> купить </Button>
        </Form>
    )
}

export default DelegateRTK;