import { Router } from 'express';
import {
    criarReserva,
    listarReservas,
    obterReserva,
    atualizarReserva,
    deletarReserva,
    verificarDisponibilidade,
    mapaReservas
} from '../controllers/reservaController';

const router = Router();

// Rotas CRUD
router.post('/', criarReserva);
router.get('/', listarReservas);
router.get('/:id', obterReserva);
router.put('/:id', atualizarReserva);
router.delete('/:id', deletarReserva);

// Rotas customizadas
router.get('/verificar-disponibilidade', verificarDisponibilidade);
router.get('/mapa-reservas', mapaReservas);

export default router;