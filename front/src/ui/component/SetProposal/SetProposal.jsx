import React, { useContext } from 'react';
import { Form, FormGroup, FormLabel, FormControl, Button } from 'react-bootstrap';
import ServiceVoting from '../../../service/ServiceVoting.jsx';
import { AppContext } from '../../../core/context/Context.jsx';

const SetProposal = () => {
    const { wallet } = useContext(AppContext);

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            const delay = (e.target[0].value);
            const period = (e.target[1].value);
            const proposeType = e.target[2].value;
            const quorumType = e.target[3].value;
            const target = e.target[4].value;
            const amount = e.target[5].value;
            console.log({
                delay,
                period,
                proposeType,
                quorumType,
                target,
                amount,
                wallet
            });
            await ServiceVoting.setProposal(
                delay, period, proposeType,  quorumType, target, amount, wallet
            );
            alert('Предложение создано');
        } catch (err) {
            console.error(err);
            alert('Ошибка при создании предложения');
        }
    };

    return (
        <Form onSubmit={handleSubmit} className="container">
            <h2> создать предложение </h2>

            <FormGroup>
                <FormLabel column={0}>Задержка до старта (delay, в блоках)</FormLabel>
                <FormControl type="number" placeholder="0" />
            </FormGroup>

            <FormGroup>
                <FormLabel column={1}>Длительность голосования (period, в блоках)</FormLabel>
                <FormControl type="number" placeholder="12" />
            </FormGroup>

            <FormGroup>
                <FormLabel column={2}>Тип (A–F)</FormLabel>
                <FormControl/>
            </FormGroup>

            <FormGroup className="mb-3">
                <FormLabel column={3}>Механизм кворума (0=Простое, 1=Супер, 2=Взвеш.)</FormLabel>
                <FormControl />
            </FormGroup>

            <FormGroup>
                <FormLabel column={4}>адрес стартапа или участника </FormLabel>
                <FormControl type="text" placeholder="0x...,0x..." />
            </FormGroup>

            <FormGroup>
                <FormLabel column={5}> количество токенов или то на которое изменяется сила токена</FormLabel>
                <FormControl type="number" placeholder="12" />
            </FormGroup>

            <Button type="submit" variant="primary">создать </Button>
        </Form>
    );
};

export default SetProposal;
