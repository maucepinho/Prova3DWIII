import React, { useState, useEffect } from 'react';
import { TextField, Button, Select, MenuItem, FormControl, InputLabel, Typography, Paper } from '@mui/material';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './FormReserva.css';

interface Reserva {
    nomeCliente: string;
    numeroMesa: number;
    dataHora: string;
    status: string;
    contatoCliente: string;
}

const FormReserva: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [reserva, setReserva] = useState<Reserva>({
        nomeCliente: '',
        numeroMesa: 1,
        dataHora: new Date().toISOString().slice(0, 16),
        status: 'reservado',
        contatoCliente: ''
    });
    const [disponivel, setDisponivel] = useState<boolean | null>(null);

    useEffect(() => {
        if (id) {
            const carregarReserva = async () => {
                try {
                    const response = await axios.get(`http://localhost:3000/api/reservas/${id}`);
                    setReserva(response.data);
                } catch (error) {
                    console.error('Erro ao carregar reserva:', error);
                }
            };
            carregarReserva();
        }
    }, [id]);

    const verificarDisponibilidade = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/reservas/verificar-disponibilidade', {
                params: {
                    numeroMesa: reserva.numeroMesa,
                    dataHora: reserva.dataHora
                }
            });
            setDisponivel(response.data.disponivel);
        } catch (error) {
            console.error('Erro ao verificar disponibilidade:', error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (id) {
                await axios.put(`http://localhost:3000/api/reservas/${id}`, reserva);
            } else {
                await axios.post('http://localhost:3000/api/reservas', reserva);
            }
            navigate('/');
        } catch (error) {
            console.error('Erro ao salvar reserva:', error);
        }
    };

    return (
        <Paper className="form-reserva-container">
            <Typography variant="h4" className="form-title">
                {id ? 'Editar Reserva' : 'Nova Reserva'}
            </Typography>
            
            <form onSubmit={handleSubmit} className="reserva-form-grid">
                <div className="form-field">
                    <TextField
                        label="Nome do Cliente"
                        fullWidth
                        value={reserva.nomeCliente}
                        onChange={(e) => setReserva({ ...reserva, nomeCliente: e.target.value })}
                        required
                    />
                </div>
                
                <div className="form-field">
                    <TextField
                        label="Contato"
                        fullWidth
                        value={reserva.contatoCliente}
                        onChange={(e) => setReserva({ ...reserva, contatoCliente: e.target.value })}
                        required
                    />
                </div>
                
                <div className="form-field">
                    <TextField
                        label="Número da Mesa"
                        type="number"
                        fullWidth
                        value={reserva.numeroMesa}
                        onChange={(e) => setReserva({ ...reserva, numeroMesa: parseInt(e.target.value) })}
                        required
                    />
                </div>
                
                <div className="form-field">
                    <TextField
                        label="Data e Hora"
                        type="datetime-local"
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        value={reserva.dataHora}
                        onChange={(e) => setReserva({ ...reserva, dataHora: e.target.value })}
                        required
                    />
                </div>
                
                <div className="form-field">
                    <Button 
                        variant="outlined" 
                        onClick={verificarDisponibilidade}
                        className="disponibilidade-btn"
                    >
                        Verificar Disponibilidade
                    </Button>
                    {disponivel !== null && (
                        <span className={`disponibilidade-status ${disponivel ? 'disponivel' : 'indisponivel'}`}>
                            {disponivel ? 'Mesa disponível' : 'Mesa indisponível'}
                        </span>
                    )}
                </div>
                
                <div className="form-field">
                    <FormControl fullWidth>
                        <InputLabel>Status</InputLabel>
                        <Select
                            value={reserva.status}
                            onChange={(e) => setReserva({ ...reserva, status: e.target.value as string })}
                            label="Status"
                        >
                            <MenuItem value="reservado">Reservado</MenuItem>
                            <MenuItem value="ocupado">Ocupado</MenuItem>
                            <MenuItem value="disponivel">Disponível</MenuItem>
                        </Select>
                    </FormControl>
                </div>
                
                <div className="form-actions">
                    <Button type="submit" variant="contained" color="primary">
                        Salvar
                    </Button>
                </div>
            </form>
        </Paper>
    );
};

export default FormReserva;