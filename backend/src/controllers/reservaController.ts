import { Request, Response } from 'express';
import Reserva, { IReserva } from '../models/Reserva';

interface ReservaParams {
    id: string;
}

interface ReservaQuery {
    cliente?: string;
    mesa?: string;
    dataHora?: string;
    numeroMesa?: string;
    data?: string;
}

// Todas as funções retornam explicitamente Promise<void>
export const criarReserva = async (req: Request<{}, {}, IReserva>, res: Response): Promise<void> => {
    try {
        const reserva = new Reserva(req.body);
        await reserva.save();
        res.status(201).json(reserva);
    } catch (error) {
        res.status(400).json({ error: (error as Error).message });
    }
};

export const listarReservas = async (req: Request<{}, {}, {}, ReservaQuery>, res: Response): Promise<void> => {
    try {
        const { cliente, mesa } = req.query;
        let filtro: any = {};
        
        if (cliente) filtro.nomeCliente = cliente;
        if (mesa) filtro.numeroMesa = Number(mesa);
        
        const reservas = await Reserva.find(filtro);
        res.json(reservas);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};

export const obterReserva = async (req: Request<ReservaParams>, res: Response): Promise<void> => {
    try {
        const reserva = await Reserva.findById(req.params.id);
        if (!reserva) {
            res.status(404).json({ error: 'Reserva não encontrada' });
            return;
        }
        res.json(reserva);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};

export const atualizarReserva = async (req: Request<ReservaParams, {}, IReserva>, res: Response): Promise<void> => {
    try {
        const reserva = await Reserva.findByIdAndUpdate(req.params.id, req.body, { 
            new: true,
            runValidators: true
        });
        if (!reserva) {
            res.status(404).json({ error: 'Reserva não encontrada' });
            return;
        }
        res.json(reserva);
    } catch (error) {
        res.status(400).json({ error: (error as Error).message });
    }
};

export const deletarReserva = async (req: Request<ReservaParams>, res: Response): Promise<void> => {
    try {
        const reserva = await Reserva.findByIdAndDelete(req.params.id);
        if (!reserva) {
            res.status(404).json({ error: 'Reserva não encontrada' });
            return;
        }
        res.json({ message: 'Reserva deletada com sucesso' });
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};

export const verificarDisponibilidade = async (req: Request<{}, {}, {}, { dataHora: string, numeroMesa: string }>, res: Response): Promise<void> => {
    try {
        const { dataHora, numeroMesa } = req.query;
        const reserva = await Reserva.findOne({ 
            numeroMesa: Number(numeroMesa),
            dataHora: { 
                $gte: new Date(dataHora),
                $lt: new Date(new Date(dataHora).getTime() + 2 * 60 * 60 * 1000) 
            },
            status: { $in: ['reservado', 'ocupado'] }
        });
        
        res.json({ disponivel: !reserva });
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};

export const mapaReservas = async (req: Request<{}, {}, {}, { data: string }>, res: Response): Promise<void> => {
    try {
        const { data } = req.query;
        const reservas = await Reserva.find({
            dataHora: { 
                $gte: new Date(data),
                $lt: new Date(new Date(data).getTime() + 24 * 60 * 60 * 1000)
            }
        });
        
        const mapa = Array.from({ length: 10 }, (_, i) => {
            const mesaNum = i + 1;
            const reserva = reservas.find(r => r.numeroMesa === mesaNum);
            return {
                mesa: mesaNum,
                status: reserva ? reserva.status : 'disponivel',
                cliente: reserva ? reserva.nomeCliente : null,
                dataHora: reserva ? reserva.dataHora : null
            };
        });
        
        res.json(mapa);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};