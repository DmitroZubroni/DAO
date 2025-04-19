import {Button, Form, FormControl, FormGroup, FormLabel} from "react-bootstrap";

const DelegateRTK = () => {

    return (
        <Form className='container'>
            <h2> Делегация токенов </h2>
            <FormGroup>
                <FormLabel column={1}>
                    кому вы дилигируете
                </FormLabel>

                <FormControl/>
            </FormGroup>

            <FormGroup>
                <FormLabel column={1}>
                    сколько
                </FormLabel>

                <FormControl/>
            </FormGroup>

            <Button type="submit" color="primary"> делегировать </Button>
        </Form>
    )
}

export default DelegateRTK;