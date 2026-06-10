import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginCustomer from './Pages/auth/loginCustomer';
import RecoveryPassCustomer from './Pages/auth/recoveryPass';
import RegisterCustomer from './Pages/auth/registerCustomer';
import Storefront from './Pages/storeFront';

function App() {

  console.log("App se está cargando...");

  return (
    <Router>
      <Routes>
        {/* RUTAS DE CLIENTE-AUTH */}
        <Route path="/" element={<LoginCustomer />} />
        <Route path="/customer/register" element={<RegisterCustomer />} />
        <Route path="/customer/recovery" element={<RecoveryPassCustomer />} />

        {/* RUTAS DE CLIENTE */}
        <Route path="/storefront" element={<Storefront />} />

        {/* 404 - Redirigir al inicio si la ruta no existe */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;