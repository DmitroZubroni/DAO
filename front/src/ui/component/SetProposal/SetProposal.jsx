// src/components/Proposals/SetProposal.jsx
import React, { useContext } from 'react';
import { Form, FormGroup, FormLabel, FormControl, Button } from 'react-bootstrap';
import ServiceVoting from '../../../service/ServiceVoting.jsx';
import { AppContext } from '../../../core/context/Context.jsx';

const SetProposal = () => {
    const { wallet } = useContext(AppContext);

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            const delay = Number(e.target[0].value);
            const period = Number(e.target[1].value);
            const proposeType = e.target[2].value;
            const quorumType = e.target[3].value;
            const params = e.target[5].value.split(',').map(s => s.trim());


            await ServiceVoting.setProposal(
                delay, period, proposeType,  quorumType, params,wallet
            );
            alert('Предложение создано');
            e.target.reset();
        } catch (err) {
            console.error(err);
            alert('Ошибка при создании предложения');
        }
    };

    return (
        <Form onSubmit={handleSubmit} className="container">
            <h2> создать предложение </h2>

            <FormGroup>
                <FormLabel column={1}>Задержка до старта (delay, в блоках)</FormLabel>
                <FormControl type="number" placeholder="0" />
            </FormGroup>

            <FormGroup>
                <FormLabel column={1}>Длительность голосования (period, в блоках)</FormLabel>
                <FormControl type="number" placeholder="12" />
            </FormGroup>

            <FormGroup>
                <FormLabel column={1}>Тип (A–F)</FormLabel>
                <FormControl as="select" defaultValue="0">
                    <option value="0">A</option>
                    <option value="1">B</option>
                    <option value="2">C</option>
                    <option value="3">D</option>
                    <option value="4">E</option>
                    <option value="5">F</option>
                </FormControl>
            </FormGroup>

            <FormGroup>
                <FormLabel column={1}>параметры зависит от типа предложения </FormLabel>
                <FormControl type="text" placeholder="0x...,0x..." />
            </FormGroup>



            <FormGroup className="mb-3">
                <FormLabel column={1}>Механизм кворума (0=Простое, 1=Супер, 2=Взвеш.)</FormLabel>
                <FormControl as="select" defaultValue="0">
                    <option value="0">SimpleMajority</option>
                    <option value="1">SuperMajority</option>
                    <option value="2">Weighted</option>
                </FormControl>

            </FormGroup>

            <Button type="submit" variant="primary">создать </Button>
        </Form>
    );
};

export default SetProposal;
