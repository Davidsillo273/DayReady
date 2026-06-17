import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginAdmin from './Pages/loginAdmin';
import Dashboard from './Pages/dashboard';
import Menu from './Pages/menu';
import Products from './Pages/products';
import Orders from './Pages/orders';
import Sales from './Pages/sales';
import Customers from './Pages/customer';
import RecoveryPass from './Pages/recoveryPass';
import InviteAdmin from './Pages/inviteAdmin';
import InviteEmployee from './Pages/InviteEmployee';
import AcceptInvitation from './Pages/acceptInvitation';
function App() {

  console.log("App se está cargando...");

  return (
    <Router>
      <Routes>

        {/* RUTAS DE ADMIN */}
        <Route path="/admin" element={<LoginAdmin />} />
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/menu" element={<Menu />} />
        <Route path="/admin/products" element={<Products />} />
        <Route path="/admin/orders" element={<Orders />} />
        <Route path="/admin/sales" element={<Sales />} />
        <Route path="/admin/customers" element={<Customers />} />|
        <Route path="/admin/inviteAdmin" element={<InviteAdmin />} />
        <Route path="/admin/inviteEmployee" element={<InviteEmployee />} />
        <Route path="/admin/accept-invitation" element={<AcceptInvitation />} />
        <Route path="/employee/accept-invitation" element={<AcceptInvitation />} />
        <Route path="/admin/recovery" element={<RecoveryPass />} />

        {/* 404 - Redirigir al inicio si la ruta no existe */}
        <Route path="*" element={<Navigate to="/admin" />} />
      </Routes>
    </Router>
  );
}

export default App;