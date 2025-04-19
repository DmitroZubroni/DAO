import {Button, Form, FormControl, FormGroup, FormLabel} from "react-bootstrap";

const CastVote = () => {
    return (
        <Form className='container'>
            <h2> Проголосовать за предложение </h2>
            <FormGroup>
                <FormLabel column={1}>
                    ID предложения
                </FormLabel>

                <FormControl/>
            </FormGroup>

            <FormGroup>
                <FormLabel column={1}>
                    за или против
                </FormLabel>

                <FormControl/>
            </FormGroup>

            <FormGroup>
                <FormLabel column={1}>
                    количество токенов которыми вы отдайте на голосование
                </FormLabel>

                <FormControl/>
            </FormGroup>

            <Button type="submit" color="primary"> прогосоовать </Button>
        </Form>
    )
}
export default CastVote;