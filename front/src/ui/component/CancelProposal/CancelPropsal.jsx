import {Button, Form, FormControl, FormGroup, FormLabel} from "react-bootstrap";

const CancelPropsal = () => {

    return (
        <Form className='container'>
            <h2> отмена предложения </h2>
            <FormGroup>
                <FormLabel column={1}>
                    ID предложения
                </FormLabel>

                <FormControl type="number" placeholder="1, 2, 3 ..."/>

            </FormGroup>

            <Button type="submit" color="primary"> отменить </Button>
        </Form>
    )
}
export default CancelPropsal