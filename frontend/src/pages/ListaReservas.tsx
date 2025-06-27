import React, { useState, useEffect } from 'react';
import { TextField, Button, Paper, Typography } from '@mui/material';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './ListaReservas.css';

interface Reserva {
    _id: string;
    nomeCliente: string;
    numeroMesa: number;
    dataHora: string;
    status: string;
    contatoCliente: string;
}

const ListaReservas: React.FC = () => {
    const [reservas, setReservas] = useState<Reserva[]>([]);
    const [filtro, setFiltro] = useState('');

    useEffect(() => {
        const carregarReservas = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/reservas');
                setReservas(response.data);
            } catch (error) {
                console.error('Erro ao carregar reservas:', error);
            }
        };
        carregarReservas();
    }, []);

    const reservasFiltradas = reservas.filter(reserva =>
        reserva.nomeCliente.toLowerCase().includes(filtro.toLowerCase()) ||
        reserva.numeroMesa.toString().includes(filtro)
    );

    return (
        <div className="lista-reservas-container">
            <div className="lista-reservas-header">
                <Typography variant="h4">Reservas</Typography>
                <TextField
                    label="Filtrar por cliente ou mesa"
                    variant="outlined"
                    value={filtro}
                    onChange={(e) => setFiltro(e.target.value)}
                    className="filtro-input"
                />
                <Button variant="contained" color="primary" component={Link} to="/reservas/nova">
                    Nova Reserva
                </Button>
            </div>

            <div className="reservas-grid">
                <div className="grid-header">
                    <div>Cliente</div>
                    <div>Mesa</div>
                    <div>Data/Hora</div>
                    <div>Status</div>
                    <div>Ações</div>
                </div>
                
                {reservasFiltradas.map((reserva) => (
                    <Paper key={reserva._id} className="reserva-item">
                        <div>{reserva.nomeCliente}</div>
                        <div>{reserva.numeroMesa}</div>
                        <div>{new Date(reserva.dataHora).toLocaleString()}</div>
                        <div>{reserva.status}</div>
                        <div>
                            <Button component={Link} to={`/reservas/${reserva._id}`} size="small">
                                Editar
                            </Button>
                        </div>
                    </Paper>
                ))}
            </div>
        </div>
    );
};

export default ListaReservas;