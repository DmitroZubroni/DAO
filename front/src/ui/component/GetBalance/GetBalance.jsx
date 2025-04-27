import { Form,  FormGroup, FormLabel} from "react-bootstrap";
import {useContext, useEffect, useState} from "react";
import ServiceVoting from "../../../service/ServiceVoting.jsx";
import {AppContext} from "../../../core/context/Context.jsx";

const GetBalance = () => {

    const {wallet} = useContext(AppContext);
    const [balance, setBalance] = useState({ profi: 0, rtk: 0, isDao: false });

    useEffect(() => {
        (async () => {
            const info = await ServiceVoting.getBalance(wallet);
            setBalance(info);
            console.log(info);
        }) ()
    }, [wallet]);

    return (
        <Form className="container">
            <h2> информация о пользователе </h2>
            <FormGroup>
                <FormLabel column={1}>
                    являектесь участником DAO: {(balance.isDao).toString()}
                </FormLabel>
            </FormGroup>
            <FormGroup>
                <FormLabel column={1}>
                    баланс в Profi {(Number(balance.profi)).toFixed(12) / 10 ** 12}
                </FormLabel>
            </FormGroup>

            <FormGroup>
                <FormLabel column={1}>
                    баланс в RTK {(Number(balance.rtk)).toFixed(12) / 10 ** 12}
                </FormLabel>
            </FormGroup>

        </Form>
    )
}
export default GetBalance;