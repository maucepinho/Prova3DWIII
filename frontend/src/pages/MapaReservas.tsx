import React, { useState, useEffect } from 'react';
import { TextField, Button, Paper, Typography } from '@mui/material';
import axios from 'axios';
import './MapaReservas.css';

interface MesaStatus {
    mesa: number;
    status: string;
    cliente: string | null;
    dataHora: string | null;
}

const MapaReservas: React.FC = () => {
    const [data, setData] = useState(new Date().toISOString().slice(0, 10));
    const [mesas, setMesas] = useState<MesaStatus[]>([]);

    useEffect(() => {
        carregarMapa();
    }, [data]);

    const carregarMapa = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/reservas/mapa-reservas', {
                params: { data }
            });
            setMesas(response.data);
        } catch (error) {
            console.error('Erro ao carregar mapa de reservas:', error);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'reservado': return '#ffeb3b'; // Amarelo
            case 'ocupado': return '#f44336'; // Vermelho
            default: return '#4caf50'; // Verde
        }
    };

    return (
        <div className="mapa-reservas-container">
            <div className="mapa-header">
                <Typography variant="h4">Mapa de Reservas</Typography>
                <div className="mapa-controls">
                    <TextField
                        label="Data"
                        type="date"
                        InputLabelProps={{ shrink: true }}
                        value={data}
                        onChange={(e) => setData(e.target.value)}
                    />
                    <Button variant="contained" onClick={carregarMapa}>
                        Atualizar
                    </Button>
                </div>
            </div>
            
            <div className="mesas-grid">
                {mesas.map((mesa) => (
                    <Paper 
                        key={mesa.mesa}
                        className="mesa-item"
                        style={{ backgroundColor: getStatusColor(mesa.status) }}
                    >
                        <Typography variant="h6">Mesa {mesa.mesa}</Typography>
                        <Typography>Status: {mesa.status}</Typography>
                        {mesa.cliente && <Typography>Cliente: {mesa.cliente}</Typography>}
                        {mesa.dataHora && (
                            <Typography>
                                Horário: {new Date(mesa.dataHora).toLocaleTimeString()}
                            </Typography>
                        )}
                    </Paper>
                ))}
            </div>
        </div>
    );
};

export default MapaReservas;