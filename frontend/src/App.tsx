import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AppBar, Toolbar, Button, Container } from '@mui/material';
import ListaReservas from './pages/ListaReservas';
import FormReserva from './pages/FormReserva';
import MapaReservas from './pages/MapaReservas';

const App: React.FC = () => {
  return (
    <Router>
      <AppBar position="static">
        <Toolbar>
          <Button color="inherit" component={Link} to="/">
            Reservas
          </Button>
          <Button color="inherit" component={Link} to="/mapa">
            Mapa
          </Button>
        </Toolbar>
      </AppBar>
      <Container style={{ marginTop: '20px' }}>
        <Routes>
          <Route path="/" element={<ListaReservas />} />
          <Route path="/reservas/nova" element={<FormReserva />} />
          <Route path="/reservas/:id" element={<FormReserva />} />
          <Route path="/mapa" element={<MapaReservas />} />
        </Routes>
      </Container>
    </Router>
  );
};

export default App;