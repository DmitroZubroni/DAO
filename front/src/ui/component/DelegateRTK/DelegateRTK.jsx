import {Button, Form, FormControl, FormGroup, FormLabel} from "react-bootstrap";
import ServiceVoting from "../../../service/ServiceVoting.jsx";
import {useContext} from "react";
import {AppContext} from "../../../core/context/Context.jsx";

const DelegateRTK = () => {

    const {wallet } = useContext(AppContext);

    const handleSubmit = async e => {
        e.preventDefault();
        const to = e.target[0].value;
        const  amount = Number(e.target[1].value);
        await ServiceVoting.delegateRTK(to, amount ,wallet);
    };

    return (
        <Form className='container' onSubmit={handleSubmit}>
            <h2> Делегация токенов </h2>
            <FormGroup>
                <FormLabel column={1}>
                    кому вы дилигируете
                </FormLabel>

                <FormControl placeholder="адрес"/>
            </FormGroup>

            <FormGroup>
                <FormLabel column={1}>
                    сколько
                </FormLabel>

                <FormControl type="number" placeholder="12" min={1}/>
            </FormGroup>

            <Button type="submit" color="primary"> делегировать </Button>
        </Form>
    )
}

export default DelegateRTK;