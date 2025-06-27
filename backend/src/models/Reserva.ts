import { Schema, model, Document } from 'mongoose';

export interface IReserva extends Document {
    nomeCliente: string;
    numeroMesa: number;
    dataHora: Date;
    status: 'reservado' | 'ocupado' | 'disponivel';
    contatoCliente: string;
}

const reservaSchema = new Schema<IReserva>({
    nomeCliente: { type: String, required: true },
    numeroMesa: { type: Number, required: true },
    dataHora: { type: Date, required: true },
    status: { 
        type: String, 
        required: true,
        enum: ['reservado', 'ocupado', 'disponivel'],
        default: 'reservado'
    },
    contatoCliente: { type: String, required: true }
}, { timestamps: true });

export default model<IReserva>('Reserva', reservaSchema);